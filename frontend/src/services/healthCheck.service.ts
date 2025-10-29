/**
 * Health Check Service
 * Pings backend server every 5 minutes to prevent Render from spinning down
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

class HealthCheckService {
  private intervalId: number | null = null;

  /**
   * Start pinging the backend health endpoint
   */
  start() {
    // Don't start multiple intervals
    if (this.intervalId) {
      return;
    }

    console.log('🏥 Starting health check service - pinging every 5 minutes');

    // Ping immediately on start
    this.ping();

    // Then ping every 5 minutes
    this.intervalId = setInterval(() => {
      this.ping();
    }, PING_INTERVAL);
  }

  /**
   * Stop pinging the backend
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🏥 Health check service stopped');
    }
  }

  /**
   * Ping the backend health endpoint
   */
  private async ping() {
    try {
      const response = await fetch(`${API_URL}/api/auth/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend health check successful:', data.timestamp);
      } else {
        console.warn('⚠️ Backend health check failed:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Backend health check error:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export const healthCheckService = new HealthCheckService();
