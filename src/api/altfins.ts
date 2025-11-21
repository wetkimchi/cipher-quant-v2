const ALTFINS_BASE_URL = "https://altfins.com/api/v1";

// Token cache
let cachedAccessToken: string | null = null;

/**
 * Authenticate with Altfins API and get access token
 */
async function authenticateAltfins(): Promise<string | null> {
  const email = process.env.ALTFINS_EMAIL;
  const password = process.env.ALTFINS_PASSWORD;

  if (!email || !password) {
    logger.error("Altfins credentials not configured");
    return null;
  }

  try {
    // Create Basic Auth header
    const credentials = Buffer.from(`${email}:${password}`).toString('base64');
    
    const response = await fetch(`${ALTFINS_BASE_URL}/authenticate`, {
      method: 'POST',
      headers: {
        'X-Authentication-Type': 'EM',
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      logger.error(`Altfins authentication failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    cachedAccessToken = data.accessToken;
    
    logger.info("Successfully authenticated with Altfins API");
    return cachedAccessToken;
  } catch (error) {
    logger.error(`Error authenticating with Altfins: ${error}`);
    return null;
  }
}

/**
 * Get valid access token (authenticate if needed)
 */
async function getValidToken(): Promise<string | null> {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }
  return await authenticateAltfins();
}

/**
 * Build query string from params with defaults
 */
function buildQueryString(params: AltfinsAnalysisParams): string {
  const queryParams = new URLSearchParams();
  queryParams.append('symbol', params.symbol);
  queryParams.append('page', (params.page ?? 0).toString());
  queryParams.append('size', (params.size ?? 100).toString());
  queryParams.append('sort', params.sort ?? 'updatedDate,DESC');
  return queryParams.toString();
}

/**
 * Fetch technical analysis data from Altfins
 */
export async function fetchAltfinsAnalysis(
  params: AltfinsAnalysisParams
): Promise<AltfinsAnalysisResponse | null> {
  try {
    const token = await getValidToken();
    if (!token) {
      logger.error("Failed to get valid Altfins token");
      return null;
    }

    const queryString = buildQueryString(params);
    const url = `${ALTFINS_BASE_URL}/technical-analysis/data?${queryString}`;
    
    logger.info(`Fetching Altfins analysis: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // If 401, try re-authenticating once
      if (response.status === 401) {
        logger.warn("Altfins token expired, re-authenticating...");
        cachedAccessToken = null;
        const newToken = await getValidToken();
        
        if (!newToken) {
          return null;
        }

        // Retry with new token
        const retryResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          },
        });

        if (!retryResponse.ok) {
          logger.error(`Altfins API error after retry: ${retryResponse.status}`);
          return null;
        }

        const data: AltfinsAnalysisResponse = await retryResponse.json();
        logger.info(`Successfully fetched Altfins analysis (after retry): ${data.numberOfElements} results`);
        return data;
      }

      logger.error(`Altfins API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: AltfinsAnalysisResponse = await response.json();
    logger.info(`Successfully fetched Altfins analysis: ${data.numberOfElements} results`);
    return data;
  } catch (error) {
    logger.error(`Error fetching Altfins analysis: ${error}`);
    return null;
  }
}

/**
 * Fetch analytics history from Altfins
 */
export async function fetchAltfinsAnalytics(
  params: AltfinsAnalyticsParams
): Promise<AltfinsAnalyticsResponse | null> {
  try {
    const token = await getValidToken();
    if (!token) {
      logger.error("Failed to get valid Altfins token");
      return null;
    }

    // Calculate default dates if not provided
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const requestBody = {
      symbol: params.symbol,
      timeInterval: params.timeInterval ?? 'DAILY',
      analyticsType: params.analyticsType ?? 'SMA10',
      from: params.from ?? thirtyDaysAgo.toISOString(),
      to: params.to ?? now.toISOString(),
    };

    const url = `${ALTFINS_BASE_URL}/public/analytics/search-requests`;

    logger.info(`Fetching Altfins analytics with params: ${JSON.stringify(requestBody)}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // If 401, try re-authenticating once
      if (response.status === 401) {
        logger.warn("Altfins token expired, re-authenticating...");
        cachedAccessToken = null;
        const newToken = await getValidToken();

        if (!newToken) {
          return null;
        }

        // Retry with new token
        const retryResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!retryResponse.ok) {
          logger.error(`Altfins API error after retry: ${retryResponse.status}`);
          return null;
        }

        const data: AltfinsAnalyticsResponse = await retryResponse.json();
        logger.info(`Successfully fetched Altfins analytics (after retry): ${data.numberOfElements} results`);
        return data;
      }

      logger.error(`Altfins API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: AltfinsAnalyticsResponse = await response.json();
    logger.info(`Successfully fetched Altfins analytics: ${data.numberOfElements} results`);
    return data;
  } catch (error) {
    logger.error(`Error fetching Altfins analytics: ${error}`);
    return null;
  }
}

/**
 * Fetch available analytics types from Altfins
 */
export async function fetchAltfinsAnalyticsTypes(): Promise<AltfinsAnalyticsType[] | null> {
  try {
    const token = await getValidToken();
    if (!token) {
      logger.error("Failed to get valid Altfins token");
      return null;
    }

    const url = `${ALTFINS_BASE_URL}/public/analytics/types`;

    logger.info(`Fetching Altfins analytics types: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // If 401, try re-authenticating once
      if (response.status === 401) {
        logger.warn("Altfins token expired, re-authenticating...");
        cachedAccessToken = null;
        const newToken = await getValidToken();

        if (!newToken) {
          return null;
        }

        // Retry with new token
        const retryResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          },
        });

        if (!retryResponse.ok) {
          logger.error(`Altfins API error after retry: ${retryResponse.status}`);
          return null;
        }

        const data: AltfinsAnalyticsType[] = await retryResponse.json();
        logger.info(`Successfully fetched Altfins analytics types (after retry): ${data.length} types`);
        return data;
      }

      logger.error(`Altfins API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: AltfinsAnalyticsType[] = await response.json();
    logger.info(`Successfully fetched Altfins analytics types: ${data.length} types`);
    return data;
  } catch (error) {
    logger.error(`Error fetching Altfins analytics types: ${error}`);
    return null;
  }
}

