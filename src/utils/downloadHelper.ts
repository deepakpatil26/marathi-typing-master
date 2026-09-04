// Helper to generate the exact launch URL for the Windows Desktop installer
// Prevents Google Cloud Run internal proxy 403 Forbidden errors when launched from outside AI Studio

export const getProductionLaunchUrl = (): string => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // If running inside Google AI Studio container sandbox, external processes cannot access it without Google cookies
    // Thus we target the user's public production deployment URL on Vercel
    if (host.includes('ais-dev-') || host.includes('ais-pre-') || host.includes('run.app')) {
      return 'https://marathi-typing-master.vercel.app/?app=true';
    }
    return `${window.location.origin}/?app=true`;
  }
  return 'https://marathi-typing-master.vercel.app/?app=true';
};
