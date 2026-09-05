/**
 * Dynamic API endpoint resolver for web and desktop environments.
 * When running in standard web mode: uses relative paths (e.g. /api/ai/generate-passage).
 * When running in desktop/Electron mode: uses VITE_API_URL if configured.
 */

export function getApiEndpoint(endpointPath: string): string {
  const cleanPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  
  // Custom API URL from environment variable if provided
  const envApiUrl = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL;
  if (envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim() !== '') {
    return `${envApiUrl.replace(/\/+$/, '')}${cleanPath}`;
  }

  // Otherwise, relative path to origin
  return cleanPath;
}

export function isElectronApp(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as unknown as { electron?: { isElectron?: boolean } }).electron?.isElectron);
}
