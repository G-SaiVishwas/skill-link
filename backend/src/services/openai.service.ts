import OpenAI from 'openai';
import { config } from '../config';
import {
  VoiceToSkillsResult,
  JobDecoderResult,
  ProfileGenerationResult,
  TrustRankResult,
} from '../types';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  /**
   * Transcribe voice audio to text using Whisper API
   */
  async transcribeVoice(audioBuffer: Buffer, filename: string): Promise<string> {
    try {
      const file = new File([audioBuffer], filename, { type: 'audio/mpeg' });
      
      const transcription = await this.client.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: 'hi', // Hindi primary, but Whisper auto-detects
      });

      return transcription.text;
    } catch (error) {
      console.error('Voice transcription error:', error);
      throw new Error('Failed to transcribe voice');
    }
  }

  /**
   * Extract skills from voice transcript or text input
   * Uses prompts/voice_to_skills.md logic
   */
  async extractSkillsFromText(
    transcript: string,
    city: string,
    country: string = 'India'
  ): Promise<VoiceToSkillsResult> {
    const prompt = `You are SkillLink's Skill Extractor. Analyze the following transcript from an informal worker describing their experience. Return a strict JSON object.

### Transcript
${transcript}

### Location Details
City: ${city}
Country: ${country}

### Expectations
- Identify actionable \`tags\` that map to worker skills (camelCase slugs where possible).
- Estimate \`experience_years\` as a number (can be fractional) when stated or implied. Use 0.5 if unknown.
- List \`languages_spoken\` as ISO language names.
- Suggest up to three \`preferred_roles\` for matching (short phrases).
- Provide a \`confidence\` score between 0 and 1 reflecting certainty of the extraction.
- Include \`notes\` with any nuances (max 280 chars).

### Output JSON Schema
{
  "tags": string[],
  "experience_years": number,
  "languages_spoken": string[],
  "preferred_roles": string[],
  "confidence": number,
  "notes": string
}

Respond with JSON only. If information is missing, make a best-effort grounded estimate and add rationale in \`notes\`.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result as VoiceToSkillsResult;
    } catch (error) {
      console.error('Skill extraction error:', error);
      throw new Error('Failed to extract skills from text');
    }
  }

  /**
   * Parse job description and extract structured data
   * Uses prompts/job_decoder.md logic
   */
  async parseJobDescription(
    jobText: string,
    employerName: string,
    city: string
  ): Promise<JobDecoderResult> {
    const prompt = `You are SkillLink's job intake analyst. Parse incoming employer job descriptions into structured data that powers matching.

### Employer Input
Company/Contact: ${employerName}
City: ${city}
Original Submission (text or transcript):
"""
${jobText}
"""

### Expectations
- Extract \`role\` (string, 3-6 words max) summarizing what worker is needed.
- Produce \`required_skills\` array (slug-like lowercase words). Include domain-specific tags if present.
- Describe \`urgency\` as one of: immediate, urgent, soon, flexible.
- Estimate \`availability_timeframe\` (e.g., "Morning shift", "Weekends", "Full day").
- Capture \`preferred_experience\` as human-readable string (can be \`null\`).
- Generate \`ai_skills\` JSON array mirroring \`required_skills\` but safe for storing in Postgres.
- Provide \`confidence\` 0-1 with a short \`confidence_notes\` explanation.

### Output JSON Schema
{
  "role": string,
  "required_skills": string[],
  "urgency": string,
  "availability_timeframe": string,
  "preferred_experience": string | null,
  "ai_skills": string[],
  "confidence": number,
  "confidence_notes": string
}

Return strict JSON. If unsure, make conservative assumptions and explain in \`confidence_notes\`.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result as JobDecoderResult;
    } catch (error) {
      console.error('Job parsing error:', error);
      throw new Error('Failed to parse job description');
    }
  }

  /**
   * Generate bilingual worker bio and rate suggestion
   * Uses prompts/profile_generation.md logic
   */
  async generateWorkerBio(context: {
    display_name: string;
    city: string;
    skills: string[];
    experience_summary?: string;
    suggested_rate?: number;
    languages?: string[];
    highlights?: string;
  }): Promise<ProfileGenerationResult> {
    const prompt = `You are SkillLink's profile stylist. Produce a short bilingual introduction for an informal worker based on structured context. Use approachable, respectful language.

### Worker Context
Name: ${context.display_name}
City: ${context.city}
Skills: ${context.skills.join(', ')}
Experience Summary: ${context.experience_summary || 'Not provided'}
Suggested Rate (if available): ₹${context.suggested_rate || 'N/A'}
Languages: ${context.languages?.join(', ') || 'English, Hindi'}
Recent Highlights: ${context.highlights || 'None'}

### Requirements
1. Output two lines:
   - Line 1 (English): Highlight strengths, specialties, availability.
   - Line 2 (Hindi): Natural tone, not a literal translation but conveys same value.
2. Suggest a fair \`daily_rate_range\` in INR (min-max) based on market norms for the city plus experience. Provide reasoning in 1 short sentence.
3. Include a \`tone\` label summarizing writing style (e.g., "warm professional").

### Output JSON Schema
{
  "english_bio": string,
  "hindi_bio": string,
  "daily_rate_range": [number, number],
  "rate_rationale": string,
  "tone": string
}

Respond with JSON only.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result as ProfileGenerationResult;
    } catch (error) {
      console.error('Bio generation error:', error);
      throw new Error('Failed to generate worker bio');
    }
  }

  /**
   * Calculate TrustRank score with explanation
   * Uses prompts/trustrank.md logic
   */
  async calculateTrustRank(signals: {
    voice_sentiment_score?: number;
    verification_count?: number;
    rating_average?: number;
    completed_jobs?: number;
    account_age_days?: number;
    flags?: string[];
  }): Promise<TrustRankResult> {
    const prompt = `You are SkillLink's TrustRank analyst. Given structured metrics for a worker, compute a trustworthy score from 0 to 100 and explain the rationale.

### Signals
- Voice Sentiment Score (0-1): ${signals.voice_sentiment_score ?? 0.5}
- Verification Count (integer): ${signals.verification_count ?? 0}
- Recent Rating Average (1-5 or null): ${signals.rating_average ?? 'null'}
- Completed Jobs (integer): ${signals.completed_jobs ?? 0}
- Account Age Days: ${signals.account_age_days ?? 0}
- Flags: ${signals.flags?.join(', ') || 'none'}

### Requirements
1. Apply the following heuristic formula (documented for engineers):
   - Base = 40
   - Sentiment Contribution = voice_sentiment_score * 20
   - Verification Contribution = min(verification_count, 5) * 4
   - Rating Contribution = (coalesce(rating_average, 4) - 3) * 12
   - Account Age Contribution = least(account_age_days / 30, 6)
   - Penalty: subtract 10 if \`flags\` includes "dispute" or "unverified"; subtract 5 if includes "low_response".
   - Clamp final score between 0 and 100.
2. Provide \`score_breakdown\` array describing each component in plain English.
3. Suggest top 2 actions to improve trust.
4. Output as JSON:
{
  "score": number,
  "score_breakdown": string[],
  "recommendations": string[]
}

Respond with JSON only.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result as TrustRankResult;
    } catch (error) {
      console.error('TrustRank calculation error:', error);
      // Fallback to basic calculation
      return this.calculateBasicTrustRank(signals);
    }
  }

  /**
   * Fallback basic TrustRank calculation without AI
   */
  private calculateBasicTrustRank(signals: any): TrustRankResult {
    let score = 40; // Base
    const breakdown: string[] = [];

    if (signals.voice_sentiment_score) {
      const sentimentBonus = signals.voice_sentiment_score * 20;
      score += sentimentBonus;
      breakdown.push(`Voice sentiment: +${sentimentBonus.toFixed(1)}`);
    }

    if (signals.verification_count) {
      const verificationBonus = Math.min(signals.verification_count, 5) * 4;
      score += verificationBonus;
      breakdown.push(`Verifications: +${verificationBonus}`);
    }

    if (signals.rating_average) {
      const ratingBonus = (signals.rating_average - 3) * 12;
      score += ratingBonus;
      breakdown.push(`Ratings: ${ratingBonus > 0 ? '+' : ''}${ratingBonus.toFixed(1)}`);
    }

    score = Math.max(0, Math.min(100, score));

    return {
      score: Math.round(score),
      score_breakdown: breakdown,
      recommendations: [
        'Get verified by employers',
        'Complete more jobs to build rating history',
      ],
    };
  }

  /**
   * Translate message to target language
   */
  async translateMessage(text: string, targetLanguage: string): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Translate the following message to ${targetLanguage}. Return only the translation, no explanations:\n\n${text}`,
          },
        ],
        temperature: 0.3,
      });

      return completion.choices[0].message.content || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original if translation fails
    }
  }
}

export const openaiService = new OpenAIService();
