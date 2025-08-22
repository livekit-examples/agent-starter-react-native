import { useEffect, useState } from 'react';

// TODO: Add your Sandbox ID here
const sandboxID = '';
const tokenEndpoint =
  'https://cloud-api.livekit.io/api/sandbox/connection-details';

// For use without a token server.
const hardcodedUrl = '';
const hardcodedToken = '';

/**
 * Retrieves a LiveKit token.
 *
 * Currently configured to use LiveKit's Sandbox token server.
 * When building an app for production, you should use your own token server.
 */
export function useConnectionDetails(): ConnectionDetails | undefined {
  const [details, setDetails] = useState<ConnectionDetails | undefined>(() => {
    return undefined;
  });

  useEffect(() => {
    fetchToken().then(details => {
      setDetails(details);
    });
  }, []);

  return details;
}

export async function fetchToken() : Promise<ConnectionDetails | undefined> {

    if (!sandboxID) {
      return {
        url: hardcodedUrl,
        token: hardcodedToken,
      };
    }
    const fetchToken = async () => {
      if (!sandboxID) {
        return undefined;
      }
      const response = await fetch(tokenEndpoint, {
        headers: { 'X-Sandbox-ID': sandboxID },
      });
      const json = await response.json();

      if (json.serverUrl && json.participantToken) {
        return {
          url: json.serverUrl,
          token: json.participantToken,
        };
      } else {
        return undefined;
      }
    };
    return fetchToken();
}

export type ConnectionDetails = {
  url: string;
  token: string;
};
