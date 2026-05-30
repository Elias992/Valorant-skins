// /api/auth.js — Proxy d'authentification Riot Games
// Nécessaire car les appels directs depuis le navigateur sont bloqués par CORS.
//
// ⚠️  SÉCURITÉ : ce proxy ne stocke RIEN. Le mot de passe transite uniquement
//     en mémoire serveur le temps d'une requête et n'est JAMAIS loggé ni persisté.
//     Seul le access_token est renvoyé au client, où il est gardé en mémoire JS.

module.exports = async function handler(req, res) {
  // CORS headers — autoriser le frontend à appeler ce proxy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Pre-flight CORS
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, region } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'username et password requis' });
  }

  try {
    // ─── Step 1 : Init cookie / session Riot ──────────────────────────
    const initResp = await fetch(
      'https://auth.riotgames.com/api/v1/authorization',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:     'play-valorant-web-prod',
          nonce:         '1',
          redirect_uri:  'https://playvalorant.com/opt_in',
          response_type: 'token id_token',
          scope:         'account openid',
        }),
      }
    );

    if (!initResp.ok) {
      throw new Error(`Init auth échoué — HTTP ${initResp.status}`);
    }

    // Récupérer les cookies de session Riot
    const rawCookies = initResp.headers.get('set-cookie') || '';

    // ─── Step 2 : Authentification avec identifiants ──────────────────
    const authResp = await fetch(
      'https://auth.riotgames.com/api/v1/authorization',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: rawCookies,
        },
        body: JSON.stringify({
          type:     'auth',
          username,
          password,
          remember: false,
        }),
      }
    );

    const authData = await authResp.json();

    // Gérer MFA (2FA requis)
    if (authData?.type === 'multifactor') {
      return res.status(401).json({
        error: '2FA activé — cette fonctionnalité ne supporte pas encore la double authentification par SMS/app. Utilise un compte sans 2FA pour tester.',
        code:  'MFA_REQUIRED',
      });
    }

    // Extraire le token depuis l'URL de redirection
    const uri = authData?.response?.parameters?.uri;
    if (!uri) {
      const errorType = authData?.error || authData?.type || 'unknown';
      if (errorType === 'auth_failure') {
        return res.status(401).json({ error: 'Identifiants incorrects (Riot ID ou mot de passe).' });
      }
      return res.status(401).json({ error: `Authentification échouée (${errorType}). Vérifie tes identifiants.` });
    }

    const tokenMatch = uri.match(/access_token=([^&]+)/);
    if (!tokenMatch) {
      return res.status(401).json({ error: 'Impossible d\'extraire le token depuis la réponse Riot.' });
    }

    const token = tokenMatch[1];

    // ⚠️ NE JAMAIS logger le token, ne jamais le stocker côté serveur
    return res.status(200).json({ token });

  } catch (err) {
    console.error('[auth.js] Erreur proxy:', err.message);
    return res.status(500).json({
      error: `Erreur serveur : ${err.message}`,
    });
  }
}
