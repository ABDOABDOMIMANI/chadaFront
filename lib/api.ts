export const API_BASE_URL = "https://chadaback-production.up.railway.app"
// For local development, uncomment the line below and comment the line above
// export const API_BASE_URL = "http://localhost:8080"

/**
 * Builds a complete image URL from a partial URL or filename
 * Handles various URL formats:
 * - Full URLs (http:// or https://) - returns as is
 * - Relative paths starting with / - prepends API_BASE_URL
 * - Filenames - adds /api/images/ prefix
 * - Old localhost URLs - replaces with current API_BASE_URL
 */
export const buildImageUrl = (url: string | null | undefined): string => {
  if (!url) return "/placeholder.svg?height=64&width=64"
  
  // Clean the URL first - remove any whitespace
  url = url.trim()
  
  // Replace old localhost URLs (both http and https)
  if (url.includes("localhost:8080")) {
    url = url.replace(/https?:\/\/localhost:8080/g, API_BASE_URL)
  }
  
  // If already a full URL (starts with http:// or https://), return as is
  // BUT: if it contains localhost, replace it
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.includes("localhost")) {
      url = url.replace(/https?:\/\/[^/]+/, API_BASE_URL)
    }
    return url
  }
  
  // If starts with /, prepend API_BASE_URL (remove duplicate slashes)
  if (url.startsWith("/")) {
    const cleanBaseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    return `${cleanBaseUrl}${url}`
  }
  
  // Otherwise, assume it's a filename and add /api/images/
  // Remove /api/images/ if it's already in the URL
  if (url.startsWith("api/images/")) {
    url = url.replace("api/images/", "")
  }
  const cleanBaseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL
  return `${cleanBaseUrl}/api/images/${url}`
}
