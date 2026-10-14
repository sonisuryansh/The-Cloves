/**
 * PulseCore Central API Client & Repository Configuration
 * Phase 12 Architecture: Typed Service & Repository Layer
 * Supports seamless switching between local Mock Repository mode and real Backend API.
 */

export interface ApiClientConfig {
  baseUrl: string
  timeoutMs: number
  mode: 'mock' | 'live'
  mockLatencyMs: number
  simulateErrors: boolean
  apiKey?: string
  headers: Record<string, string>
}

export class ApiError extends Error {
  statusCode: number
  details?: unknown
  timestamp: string

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'https://api.pulsecore.internal/v1',
  timeoutMs: 8000,
  mode: 'mock',
  mockLatencyMs: 0,
  simulateErrors: false,
  apiKey: 'pc_live_mock_8f93a1e2b4',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-PulseCore-Client': 'PulseCore-Web/1.0.0'
  }
}

// Global active configuration state
export let apiConfig: ApiClientConfig = { ...DEFAULT_CONFIG }

// Listeners for configuration updates
type ConfigChangeListener = (config: ApiClientConfig) => void
const listeners = new Set<ConfigChangeListener>()

export function getApiClientConfig(): ApiClientConfig {
  return { ...apiConfig }
}

export function updateApiClientConfig(updates: Partial<ApiClientConfig>): ApiClientConfig {
  apiConfig = {
    ...apiConfig,
    ...updates,
    headers: {
      ...apiConfig.headers,
      ...(updates.headers || {})
    }
  }
  listeners.forEach((listener) => {
    try {
      listener(apiConfig)
    } catch (e) {
      console.error('Error in apiConfig listener:', e)
    }
  })
  return { ...apiConfig }
}

export function resetApiClientConfig(): ApiClientConfig {
  apiConfig = { ...DEFAULT_CONFIG }
  listeners.forEach((listener) => listener(apiConfig))
  return { ...apiConfig }
}

export function subscribeToApiConfig(listener: ConfigChangeListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Utility helper to simulate configurable network latency in mock service operations.
 */
export async function simulateNetworkDelay(): Promise<void> {
  if (apiConfig.simulateErrors) {
    throw new ApiError('Simulated network fault triggered by Client Configuration.', 503, {
      endpoint: 'mock-pipeline',
      reason: 'User activated Error Simulation in PulseCore Settings'
    })
  }

  if (apiConfig.mockLatencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, apiConfig.mockLatencyMs))
  }
}

/**
 * Universal HTTP request wrapper for future live backend connectivity.
 */
export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  await simulateNetworkDelay()

  const url = `${apiConfig.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeoutMs)

  try {
    const headers = new Headers(apiConfig.headers)
    if (apiConfig.apiKey) {
      headers.set('Authorization', `Bearer ${apiConfig.apiKey}`)
    }
    if (options.headers) {
      const extra = new Headers(options.headers)
      extra.forEach((val, key) => headers.set(key, val))
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers
    })

    if (!response.ok) {
      let errBody: unknown
      try {
        errBody = await response.json()
      } catch {
        errBody = await response.text()
      }
      throw new ApiError(
        `API request failed: ${response.statusText} (${response.status})`,
        response.status,
        errBody
      )
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${apiConfig.timeoutMs}ms`, 408)
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown network failure',
      0,
      error
    )
  } finally {
    clearTimeout(timeoutId)
  }
}
