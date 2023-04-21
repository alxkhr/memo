import { UAParser } from 'ua-parser-js';

export function matchUserAgent(
  requestUserAgent: string | undefined,
  storedUserAgent: string,
): boolean {
  const parsedUserAgent = new UAParser(requestUserAgent);
  // TODO decode the user agent string (sensitive data)
  const parsedStoredUserAgent = new UAParser(storedUserAgent);
  return (
    parsedUserAgent.getOS().name === parsedStoredUserAgent.getOS().name &&
    parsedUserAgent.getBrowser().name ===
      parsedStoredUserAgent.getBrowser().name
  );
}
