/**
 * Security utilities for API protection
 * Prevents abuse and protects OpenAI API key
 */

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
  blockUntil?: number
}

// In-memory rate limit store (for production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration
const RATE_LIMIT_CONFIG = {
  // Max requests per window
  MAX_REQUESTS_PER_WINDOW: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20'),
  // Window duration in milliseconds (default: 1 minute)
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  // Max message length
  MAX_MESSAGE_LENGTH: parseInt(process.env.MAX_MESSAGE_LENGTH || '5000'),
  // Max request size in bytes
  MAX_REQUEST_SIZE: parseInt(process.env.MAX_REQUEST_SIZE || '100000'), // 100KB
  // Block duration after exceeding limit (in ms)
  BLOCK_DURATION_MS: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION || '300000'), // 5 minutes
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockUntil || entry.blockUntil < now)) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

/**
 * Get client identifier from request
 */
function getClientId(request: Request): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = cfConnectingIp || realIp || (forwarded ? forwarded.split(',')[0].trim() : 'unknown')
  
  // Also use user agent for additional identification
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}:${userAgent.slice(0, 50)}`
}

/**
 * Check rate limit for a client
 */
export function checkRateLimit(request: Request): {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
} {
  const clientId = getClientId(request)
  const now = Date.now()
  
  let entry = rateLimitStore.get(clientId)
  
  // Check if client is blocked
  if (entry?.blocked && entry.blockUntil && entry.blockUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockUntil,
      retryAfter: Math.ceil((entry.blockUntil - now) / 1000),
    }
  }
  
  // Reset if window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS,
      blocked: false,
    }
  }
  
  // Check if limit exceeded
  if (entry.count >= RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW) {
    // Block the client
    entry.blocked = true
    entry.blockUntil = now + RATE_LIMIT_CONFIG.BLOCK_DURATION_MS
    rateLimitStore.set(clientId, entry)
    
    console.warn(`Rate limit exceeded for client: ${clientId}`)
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockUntil,
      retryAfter: Math.ceil((entry.blockUntil - now) / 1000),
    }
  }
  
  // Increment count
  entry.count++
  rateLimitStore.set(clientId, entry)
  
  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Validate and sanitize user input
 */
export function validateInput(message: string, context?: any): {
  valid: boolean
  error?: string
  sanitized?: string
} {
  // Check message length
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required and must be a string' }
  }
  
  if (message.length > RATE_LIMIT_CONFIG.MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message too long. Maximum length is ${RATE_LIMIT_CONFIG.MAX_MESSAGE_LENGTH} characters.`,
    }
  }
  
  // Check for suspicious patterns (potential injection attempts)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /exec\(/i,
    /\$\{/,
  ]
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      console.warn(`Suspicious input detected: ${pattern}`)
      return { valid: false, error: 'Invalid input detected' }
    }
  }
  
  // Basic sanitization (remove null bytes, trim)
  const sanitized = message.replace(/\0/g, '').trim()
  
  if (sanitized.length === 0) {
    return { valid: false, error: 'Message cannot be empty' }
  }
  
  // Validate context size if provided
  if (context) {
    const contextSize = JSON.stringify(context).length
    if (contextSize > RATE_LIMIT_CONFIG.MAX_REQUEST_SIZE) {
      return {
        valid: false,
        error: 'Request context too large',
      }
    }
  }
  
  return { valid: true, sanitized }
}

/**
 * Check if API key protection is enabled and validate
 */
export function checkApiKeyProtection(request: Request): {
  required: boolean
  valid: boolean
} {
  const apiKey = process.env.CHAT_API_KEY
  
  // If no API key is set, protection is not required
  if (!apiKey) {
    return { required: false, valid: true }
  }
  
  // Check for API key in header
  const providedKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!providedKey) {
    return { required: true, valid: false }
  }
  
  return { required: true, valid: providedKey === apiKey }
}

/**
 * Get security headers for response
 */
export function getSecurityHeaders(rateLimitInfo: {
  remaining: number
  resetTime: number
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW.toString(),
    'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
    'X-RateLimit-Reset': new Date(rateLimitInfo.resetTime).toISOString(),
  }
}

/**
 * Log security event for monitoring
 */
export function logSecurityEvent(
  type: 'rate_limit' | 'invalid_input' | 'api_key_failed' | 'suspicious_activity',
  details: Record<string, any>
): void {
  console.warn(`[SECURITY] ${type}:`, {
    ...details,
    timestamp: new Date().toISOString(),
  })
}

