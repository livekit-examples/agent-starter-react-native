import { TokenSource, TokenSourceBase, TokenSourceResponseObject } from 'livekit-client';
import { createContext, useContext, useMemo, useState } from 'react';
import { SessionProvider, useSession } from '@livekit/components-react';

// TODO: Add your development token server ID here.
// Find it on your LiveKit Cloud project's Settings page under "Development token server".
// See https://docs.livekit.io/frontends/build/authentication/development-token-server/
// (This setting was previously called the sandbox token server.)
const tokenServerId = '';

// The name of the agent you wish to be dispatched.
const agentName = undefined

// NOTE: If you prefer not to use the token server for testing, you can generate your
// tokens manually by visiting https://cloud.livekit.io/projects/p_/settings/keys
// and using one of your API Keys to generate a token with custom TTL and permissions.

// For use without a token server.
const hardcodedUrl = '';
const hardcodedToken = '';

// Fallback: If no other agent connection is configured, connect to homepage agent 
const homepageAgentUrl = "https://livekit.com/api/homepage-agent/token";

interface ConnectionContextType {
  isConnectionActive: boolean;
  connect: () => void;
  disconnect: () => void;
}

const ConnectionContext = createContext<ConnectionContextType>({
  isConnectionActive: false,
  connect: () => {},
  disconnect: () => {},
});

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return ctx;
}

interface ConnectionProviderProps {
  children: React.ReactNode;
}

export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const [isConnectionActive, setIsConnectionActive] = useState(false);

  const tokenSource = useMemo(() => {
    if (tokenServerId) {
      return TokenSource.developmentTokenServer(tokenServerId)
    } else if (hardcodedUrl && hardcodedToken) {
      return TokenSource.literal(
        {
          serverUrl: hardcodedUrl,
          participantToken: hardcodedToken,
        } satisfies TokenSourceResponseObject
      )
    } else {
      return TokenSource.endpoint(homepageAgentUrl)
    }
  }, [tokenServerId, hardcodedUrl, hardcodedToken])

  const session = useSession(
    tokenSource,
    agentName ? { agentName } : undefined
  );

  const { start: startSession, end: endSession } = session;

  const value = useMemo(() => {
    return {
      isConnectionActive,
      connect: () => {
        setIsConnectionActive(true);
        startSession();
      },
      disconnect: () => {
        setIsConnectionActive(false);
        endSession();
      },
    };
  }, [startSession, endSession, isConnectionActive]);

  return (
    <SessionProvider session={session}>
      <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
    </SessionProvider>
  );
}
