// /api/auth.js — Proxy OAuth Riot Games (échange code → token)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code, region } = req.body || {};
  if (!code) return res.status(400).json({ error: 'code manquant' });

  try {
    // Échanger le code contre un access_token
    const tokenResp = await fetch('https://auth.riotgames.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        redirect_uri: 'http://localhost/redirect',
        client_id:    'riot-client',
      }).toString(),
    });

    const tokenData = await tokenResp.json();

    if (!tokenResp.ok || !tokenData.access_token) {
      const msg = tokenData.error_description || tokenData.error || `HTTP ${tokenResp.status}`;
      return res.status(401).json({ error: `Échange de token échoué : ${msg}` });
    }

    // Renvoyer uniquement le token — jamais stocké côté serveur
    return res.status(200).json({ token: tokenData.access_token });

  } catch (err) {
    console.error('[auth.js]', err.message);
    return res.status(500).json({ error: `Erreur serveur : ${err.message}` });
  }
};