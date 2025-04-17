// /pages/api/safaricom/register.ts or /app/api/safaricom/register/route.ts (adjust for App Router)
export async function handler(req: any, res: any) {
  const consumerKey = 'ghghghghghghghgh';
  const consumerSecret = 'gghh';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    // Step 1: Get access token
    const accessTokenRes = await fetch('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const tokenData = await accessTokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Register URL
    const registerRes = await fetch('https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ShortCode: '12345',
        ResponseType: 'Confirmed',
        ConfirmationURL: 'https://pocketshop.co.ke/api/safaricom/confirmation',
        ValidationURL: 'https://pocketshop.co.ke/api/safaricom/validation',
      }),
    });

    const registerData = await registerRes.json();
    res.status(200).json(registerData);
  } catch (error: any) {
    console.error('Safaricom Register Error:', error);
    res.status(500).json({ error: 'Failed to register URLs' });
  }
}

// If you're using App Router, export like this instead:
export { handler as GET, handler as POST };
