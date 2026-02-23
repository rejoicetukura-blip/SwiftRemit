import { Router, Request, Response } from 'express';
import { getCurrencyConfigLoader } from '../config';

const router = Router();

/**
 * GET /api/admin/stats
 * Returns platform statistics and metrics
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const configLoader = getCurrencyConfigLoader();
    const currencies = configLoader.getCurrencies();

    const stats = {
      success: true,
      data: {
        platform: {
          status: 'operational',
          uptime: process.uptime(),
          version: '1.0.0',
        },
        currencies: {
          total: currencies.length,
          supported: currencies.map(c => c.code),
        },
        system: {
          memory: {
            used: process.memoryUsage().heapUsed,
            total: process.memoryUsage().heapTotal,
          },
          node_version: process.version,
          environment: process.env.NODE_ENV || 'development',
        },
      },
      timestamp: new Date().toISOString(),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to retrieve stats',
        code: 'STATS_RETRIEVAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/admin/health
 * Returns detailed health check information
 */
router.get('/health', (req: Request, res: Response) => {
  try {
    const configLoader = getCurrencyConfigLoader();
    const currencies = configLoader.getCurrencies();

    const health = {
      success: true,
      data: {
        status: 'healthy',
        checks: {
          configuration: {
            status: currencies.length > 0 ? 'pass' : 'fail',
            currencies_loaded: currencies.length,
          },
          memory: {
            status: process.memoryUsage().heapUsed < process.memoryUsage().heapTotal * 0.9 ? 'pass' : 'warn',
            usage_percent: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100),
          },
          uptime: {
            status: process.uptime() > 0 ? 'pass' : 'fail',
            seconds: Math.floor(process.uptime()),
          },
        },
      },
      timestamp: new Date().toISOString(),
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Health check failed',
        code: 'HEALTH_CHECK_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/admin/config
 * Returns current configuration summary
 */
router.get('/config', (req: Request, res: Response) => {
  try {
    const configLoader = getCurrencyConfigLoader();
    const currencies = configLoader.getCurrencies();

    const config = {
      success: true,
      data: {
        currencies: {
          count: currencies.length,
          codes: currencies.map(c => c.code),
        },
        environment: {
          node_env: process.env.NODE_ENV || 'development',
          port: process.env.PORT || 3000,
          config_path: process.env.CURRENCY_CONFIG_PATH || './config/currencies.json',
          overrides_enabled: process.env.CURRENCY_CONFIG_ENV_OVERRIDE === 'true',
        },
        rate_limiting: {
          window_ms: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
          max_requests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
        },
      },
      timestamp: new Date().toISOString(),
    };

    res.json(config);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to retrieve config',
        code: 'CONFIG_RETRIEVAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
