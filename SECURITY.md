# Security Documentation

This document outlines the security measures implemented to protect your OpenAI API key and prevent abuse.

## Security Features

### 1. Rate Limiting
- **Default**: 20 requests per minute per IP address
- **Block Duration**: 5 minutes after exceeding limit
- **Configurable**: Set via environment variables
- **Storage**: In-memory (for production, consider Redis)

### 2. Input Validation
- **Message Length**: Maximum 5,000 characters (configurable)
- **Request Size**: Maximum 100KB (configurable)
- **Sanitization**: Removes null bytes and suspicious patterns
- **Pattern Detection**: Blocks potential injection attempts

### 3. Optional API Key Protection
- Set `CHAT_API_KEY` environment variable to enable
- Clients must include API key in `X-API-Key` header or `Authorization: Bearer <key>`
- Recommended for production deployments

### 4. Abuse Detection
- Logs all security events (rate limits, invalid inputs, etc.)
- Tracks suspicious patterns
- Automatic blocking of abusive clients

## Environment Variables

### Required
- `OPENAI_API_KEY` - Your OpenAI API key

### Optional Security Settings
```bash
# API Key Protection (recommended for production)
CHAT_API_KEY=your_secret_api_key_here

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=20          # Max requests per window
RATE_LIMIT_WINDOW_MS=60000          # Window duration (1 minute)
RATE_LIMIT_BLOCK_DURATION=300000    # Block duration (5 minutes)

# Input Limits
MAX_MESSAGE_LENGTH=5000             # Max message length
MAX_REQUEST_SIZE=100000             # Max request size in bytes
```

## Production Recommendations

### 1. Enable API Key Protection
```bash
CHAT_API_KEY=generate_a_strong_random_key_here
```

Then clients must include:
```javascript
headers: {
  'X-API-Key': 'your_secret_api_key_here'
}
```

### 2. Use Redis for Rate Limiting
For production, replace the in-memory rate limiter with Redis:
- Better performance across multiple server instances
- Persistent rate limit data
- Can handle higher traffic

### 3. Monitor Security Events
Check your logs regularly for:
- Rate limit violations
- Invalid input attempts
- API key failures
- Suspicious patterns

### 4. Set Appropriate Limits
Adjust rate limits based on your usage:
- Lower limits for public APIs
- Higher limits for authenticated users
- Consider different limits for different user tiers

### 5. Use Vercel Edge Config or Upstash Redis
For serverless deployments, consider:
- Vercel Edge Config for rate limiting
- Upstash Redis for distributed rate limiting
- Cloudflare Workers for edge-based protection

## Security Headers

The API returns rate limit information in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: When the rate limit window resets

## Best Practices

1. **Never expose your OpenAI API key** - Always keep it server-side
2. **Use API key protection in production** - Prevents unauthorized access
3. **Monitor your usage** - Check OpenAI dashboard regularly
4. **Set spending limits** - Configure limits in OpenAI dashboard
5. **Use environment variables** - Never commit secrets to git
6. **Rotate keys regularly** - Change API keys periodically
7. **Implement logging** - Track all API usage for auditing

## Response Codes

- `200` - Success (streaming response)
- `400` - Bad request (invalid input)
- `401` - Unauthorized (invalid/missing API key)
- `413` - Payload too large
- `429` - Rate limit exceeded
- `500` - Internal server error

## Example: Using API Key Protection

```javascript
// Client-side request
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.NEXT_PUBLIC_CHAT_API_KEY, // Only if you want to expose it
  },
  body: JSON.stringify({
    message: 'Hello',
    mode: 'brainstorming',
  }),
})
```

**Note**: For client-side usage, you'd need to expose the API key (not recommended). Better to use server-side proxy or require authentication.

## Upgrading to Production-Grade Security

For high-traffic production deployments:

1. **Replace in-memory rate limiting** with Redis/Upstash
2. **Add request signing** for additional security
3. **Implement IP allowlisting** for known clients
4. **Add CAPTCHA** for anonymous users
5. **Use authentication** (Supabase Auth) for better tracking
6. **Set up monitoring** (Sentry, LogRocket, etc.)
7. **Implement request queuing** for high traffic

