import { supabaseService } from './supabase.service';
import { geoService } from './geo.service';
import { MATCH_WEIGHTS } from '../config/constants';
import { SuggestedWorker } from '../types';

interface MatchingCriteria {
  requiredSkills: string[];
  latitude?: number;
  longitude?: number;
  maxRadiusKm?: number;
  maxRate?: number;
  minTrustRank?: number;
}

class MatchingService {
  /**
   * Find and rank workers for a job request
   */
  async findMatchingWorkers(
    jobId: string,
    criteria: MatchingCriteria,
    employerProfile: any
  ): Promise<SuggestedWorker[]> {
    try {
      // Get all available workers with their skills
      const { data: workersData, error } = await supabaseService
        .getClient()
        .from('worker_profiles_view')
        .select('*')
        .eq('availability_status', 'available');

      if (error) throw error;

      if (!workersData || workersData.length === 0) {
        return [];
      }

      // Score and filter workers
      const scoredWorkers: Array<SuggestedWorker & { raw_score: number }> = [];

      for (const worker of workersData) {
        const score = this.calculateMatchScore(worker, criteria, employerProfile);

        if (score.total >= 50) {
          // Minimum threshold: 50%
          const distance =
            criteria.latitude && criteria.longitude && worker.latitude && worker.longitude
              ? geoService.calculateDistance(
                  criteria.latitude,
                  criteria.longitude,
                  worker.latitude,
                  worker.longitude
                )
              : null;

          scoredWorkers.push({
            worker_id: worker.id,
            match_id: '', // Will be set after creating match
            score: Math.round(score.total),
            name: worker.display_name,
            photo_url: worker.photo_url,
            bio: worker.bio_generated,
            skills: worker.skill_tags || [],
            rate_per_hour: worker.suggested_rate,
            distance_km: distance,
            trustrank: worker.trustrank || 0,
            raw_score: score.total,
          });
        }
      }

      // Sort by score descending
      scoredWorkers.sort((a, b) => b.raw_score - a.raw_score);

      // Create match records for top workers
      const topWorkers = scoredWorkers.slice(0, 10); // Top 10 matches

      for (const worker of topWorkers) {
        const match = await supabaseService.createMatch({
          request_id: jobId,
          worker_id: worker.worker_id,
          score: worker.score / 100, // Store as decimal 0-1
          status: 'suggested',
        });
        worker.match_id = match.id;
      }

      return topWorkers.map(({ raw_score, ...rest }) => rest);
    } catch (error) {
      console.error('Matching error:', error);
      return [];
    }
  }

  /**
   * Calculate match score based on multiple factors
   */
  private calculateMatchScore(
    worker: any,
    criteria: MatchingCriteria,
    employerProfile: any
  ): { total: number; breakdown: Record<string, number> } {
    let total = 0;
    const breakdown: Record<string, number> = {};

    // 1. Skill match (40% weight)
    const skillScore = this.calculateSkillScore(
      worker.skill_tags || [],
      criteria.requiredSkills
    );
    breakdown.skills = skillScore * MATCH_WEIGHTS.SKILL_MATCH * 100;
    total += breakdown.skills;

    // 2. Distance (25% weight)
    if (
      criteria.latitude &&
      criteria.longitude &&
      worker.latitude &&
      worker.longitude
    ) {
      const distanceScore = this.calculateDistanceScore(
        criteria.latitude,
        criteria.longitude,
        worker.latitude,
        worker.longitude,
        criteria.maxRadiusKm || 50
      );
      breakdown.distance = distanceScore * MATCH_WEIGHTS.DISTANCE * 100;
      total += breakdown.distance;
    } else {
      // City match fallback
      if (worker.location_city && employerProfile.location_city) {
        const cityMatch =
          worker.location_city.toLowerCase() ===
          employerProfile.location_city.toLowerCase();
        breakdown.distance = (cityMatch ? 1 : 0.5) * MATCH_WEIGHTS.DISTANCE * 100;
        total += breakdown.distance;
      }
    }

    // 3. TrustRank (20% weight)
    const trustScore = this.normalizeTrustRank(worker.trustrank || 0);
    breakdown.trustrank = trustScore * MATCH_WEIGHTS.TRUSTRANK * 100;
    total += breakdown.trustrank;

    // 4. Rate compatibility (10% weight)
    if (worker.suggested_rate && criteria.maxRate) {
      const rateScore = this.calculateRateScore(
        worker.suggested_rate,
        criteria.maxRate
      );
      breakdown.rate = rateScore * MATCH_WEIGHTS.RATE * 100;
      total += breakdown.rate;
    } else {
      breakdown.rate = 0.5 * MATCH_WEIGHTS.RATE * 100; // Neutral if no rate info
      total += breakdown.rate;
    }

    // 5. Availability (5% weight)
    const availabilityScore = worker.availability_status === 'available' ? 1 : 0;
    breakdown.availability = availabilityScore * MATCH_WEIGHTS.AVAILABILITY * 100;
    total += breakdown.availability;

    return { total, breakdown };
  }

  /**
   * Calculate skill match score using Jaccard similarity
   */
  private calculateSkillScore(workerSkills: string[], requiredSkills: string[]): number {
    if (requiredSkills.length === 0) return 1;

    const workerSet = new Set(workerSkills.map((s) => s.toLowerCase()));
    const requiredSet = new Set(requiredSkills.map((s) => s.toLowerCase()));

    let matches = 0;
    for (const skill of requiredSet) {
      if (workerSet.has(skill)) {
        matches++;
      }
    }

    const jaccardScore = matches / requiredSet.size;

    // Bonus for having extra relevant skills
    const bonus = Math.min(workerSkills.length / 10, 0.2);

    return Math.min(jaccardScore + bonus, 1);
  }

  /**
   * Calculate distance score (closer = higher score)
   */
  private calculateDistanceScore(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    maxRadius: number
  ): number {
    const distance = geoService.calculateDistance(lat1, lng1, lat2, lng2);

    if (distance > maxRadius) return 0;

    // Exponential decay: closer locations get much higher scores
    return Math.exp(-distance / (maxRadius / 3));
  }

  /**
   * Normalize TrustRank to 0-1 scale
   */
  private normalizeTrustRank(trustrank: number): number {
    // Assuming trustrank is 0-5 scale
    return Math.min(trustrank / 5, 1);
  }

  /**
   * Calculate rate compatibility score
   */
  private calculateRateScore(workerRate: number, maxRate: number): number {
    if (workerRate <= maxRate * 0.8) return 1; // Great deal
    if (workerRate <= maxRate) return 0.7; // Acceptable
    if (workerRate <= maxRate * 1.2) return 0.4; // Slightly over budget
    return 0.1; // Too expensive
  }
}

export const matchingService = new MatchingService();
