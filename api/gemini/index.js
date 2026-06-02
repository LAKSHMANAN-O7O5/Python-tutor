const MAX_RETRIES = 3;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Parse retry delay from Gemini error message (e.g. "Please retry in 22.044876275s.")
function parseRetryDelay(data) {
  try {
    const msg = data?.error?.message || JSON.stringify(data);
    const match = msg.match(/retry in ([\d.]+)s/i);
    if (match) return Math.ceil(parseFloat(match[1]) * 1000); // convert to ms
  } catch {}
  return null;
}

async function fetchWithRetry(url, options) {
  let lastResponse = null;
  let lastData = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    lastResponse = await fetch(url, options);
    lastData = await lastResponse.json();

    // If not rate-limited, return immediately
    if (lastResponse.status !== 429) {
      return { response: lastResponse, data: lastData };
    }

    // Don't retry after last attempt
    if (attempt === MAX_RETRIES) break;

    // Calculate wait time: use API hint or exponential backoff (5s, 10s, 20s)
    const hintDelay = parseRetryDelay(lastData);
    const backoffDelay = 5000 * Math.pow(2, attempt);
    const waitMs = Math.min(hintDelay || backoffDelay, 30000); // cap at 30s

    console.log(`Rate limited, retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
    await sleep(waitMs);
  }

  return { response: lastResponse, data: lastData };
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on Vercel' });
  }

  try {
    const { response, data } = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying to Gemini:', error);
    res.status(500).json({ error: error.message });
  }
}
