export const API_PREFIX = '/api/v1'
export const CLOUD_API_ORIGIN = 'https://tea-platform-api-231619-7-1409876108.sh.run.tcloudbase.com'

const ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '')
const ensureLeadingSlash = (value = '') => (value.startsWith('/') ? value : `/${value}`)

export const resolveApiBaseUrl = ({
  envBaseUrl,
  isH5 = typeof window !== 'undefined',
  cloudOrigin = CLOUD_API_ORIGIN
} = {}) => {
  if (envBaseUrl) {
    return trimTrailingSlash(envBaseUrl)
  }

  return isH5 ? API_PREFIX : `${trimTrailingSlash(cloudOrigin)}${API_PREFIX}`
}

export const buildApiUrl = (
  path,
  { baseUrl = resolveApiBaseUrl() } = {}
) => {
  if (!path) {
    return trimTrailingSlash(baseUrl)
  }

  if (ABSOLUTE_URL_PATTERN.test(path) || path.startsWith('//')) {
    return path
  }

  const normalizedBase = trimTrailingSlash(baseUrl)
  const normalizedPath = ensureLeadingSlash(path)

  if (normalizedBase === API_PREFIX) {
    return normalizedPath.startsWith(API_PREFIX)
      ? normalizedPath
      : `${API_PREFIX}${normalizedPath}`
  }

  if (normalizedBase.endsWith(API_PREFIX)) {
    return normalizedPath.startsWith(API_PREFIX)
      ? `${normalizedBase}${normalizedPath.slice(API_PREFIX.length)}`
      : `${normalizedBase}${normalizedPath}`
  }

  return `${normalizedBase}${normalizedPath}`
}
