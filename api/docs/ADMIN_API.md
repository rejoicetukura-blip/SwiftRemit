# Admin API Documentation

## Overview

The Admin API provides endpoints for monitoring, analytics, and management of the SwiftRemit platform.

## Authentication

All admin endpoints require authentication (to be implemented based on your auth strategy).

## Endpoints

### GET /api/admin/stats

Returns comprehensive platform statistics and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "platform": {
      "status": "operational",
      "uptime": 12345.67,
      "version": "1.0.0"
    },
    "currencies": {
      "total": 11,
      "supported": ["USD", "EUR", "GBP", ...]
    },
    "system": {
      "memory": {
        "used": 50000000,
        "total": 100000000
      },
      "node_version": "v18.0.0",
      "environment": "production"
    }
  },
  "timestamp": "2026-02-23T10:30:00.000Z"
}
```

### GET /api/admin/health

Returns detailed health check information for monitoring.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "checks": {
      "configuration": {
        "status": "pass",
        "currencies_loaded": 11
      },
      "memory": {
        "status": "pass",
        "usage_percent": 50
      },
      "uptime": {
        "status": "pass",
        "seconds": 12345
      }
    }
  },
  "timestamp": "2026-02-23T10:30:00.000Z"
}
```

**Health Status Values:**
- `pass` - Check passed successfully
- `warn` - Check passed with warnings
- `fail` - Check failed

### GET /api/admin/config

Returns current configuration summary (non-sensitive information only).

**Response:**
```json
{
  "success": true,
  "data": {
    "currencies": {
      "count": 11,
      "codes": ["USD", "EUR", "GBP", ...]
    },
    "environment": {
      "node_env": "production",
      "port": 3000,
      "config_path": "./config/currencies.json",
      "overrides_enabled": false
    },
    "rate_limiting": {
      "window_ms": 900000,
      "max_requests": 100
    }
  },
  "timestamp": "2026-02-23T10:30:00.000Z"
}
```

## Error Responses

All admin endpoints return consistent error format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  },
  "timestamp": "2026-02-23T10:30:00.000Z"
}
```

## Usage Examples

### cURL

```bash
# Get platform stats
curl http://localhost:3000/api/admin/stats

# Get health check
curl http://localhost:3000/api/admin/health

# Get configuration
curl http://localhost:3000/api/admin/config
```

### JavaScript/TypeScript

```typescript
import axios from 'axios';

// Get platform stats
const stats = await axios.get('http://localhost:3000/api/admin/stats');
console.log(stats.data);

// Get health check
const health = await axios.get('http://localhost:3000/api/admin/health');
console.log(health.data);

// Get configuration
const config = await axios.get('http://localhost:3000/api/admin/config');
console.log(config.data);
```

## Monitoring Integration

### Prometheus

The health endpoint can be used for Prometheus monitoring:

```yaml
scrape_configs:
  - job_name: 'swiftremit-api'
    metrics_path: '/api/admin/health'
    static_configs:
      - targets: ['localhost:3000']
```

### Kubernetes

Use the health endpoint for liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /api/admin/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/admin/health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Security Considerations

1. **Authentication Required**: All admin endpoints should be protected with authentication
2. **Rate Limiting**: Admin endpoints have separate rate limits
3. **Audit Logging**: All admin actions should be logged
4. **IP Whitelisting**: Consider restricting admin access to specific IPs
5. **HTTPS Only**: Admin endpoints should only be accessible over HTTPS in production

## Future Enhancements

- [ ] Admin authentication middleware
- [ ] Role-based access control
- [ ] Audit log endpoints
- [ ] Real-time metrics streaming
- [ ] Alert configuration
- [ ] Performance analytics
- [ ] User activity tracking
- [ ] System maintenance controls
