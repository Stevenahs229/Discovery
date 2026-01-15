/**
 * Utilitaire pour nettoyer les tokens invalides sans faire d'appels réseau
 * Cela évite les erreurs 401 au démarrage de l'application
 */

/**
 * Nettoie les tokens invalides du localStorage
 * Cette fonction NE FAIT AUCUN APPEL RÉSEAU
 * Elle se contente de vérifier la structure basique du token
 */
export function cleanInvalidTokens(): void {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    // Pas de token = tout est ok
    return;
  }

  // Vérifier que le token ressemble à un JWT valide (3 parties séparées par des points)
  const parts = token.split('.');
  if (parts.length !== 3) {
    // Token malformé, le supprimer
    console.log('[Auth] Token malformé détecté, nettoyage...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin_email');
    return;
  }

  try {
    // Essayer de décoder la partie payload (deuxième partie)
    const payload = JSON.parse(atob(parts[1]));
    
    // Vérifier si le token est expiré
    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      
      if (now >= expirationDate) {
        console.log('[Auth] Token expiré détecté, nettoyage...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('admin_email');
        return;
      }
    }

    // Le token semble valide structurellement
    console.log('[Auth] Token structurellement valide trouvé');
  } catch (error) {
    // Erreur lors du décodage = token invalide
    console.log('[Auth] Erreur de décodage du token, nettoyage...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin_email');
  }
}

/**
 * Vérifie si un utilisateur a un token (sans vérifier s'il est valide côté serveur)
 */
export function hasToken(): boolean {
  const token = localStorage.getItem('access_token');
  return !!token;
}

/**
 * Nettoie toute la session utilisateur
 */
export function clearSession(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('admin_email');
  sessionStorage.clear();
  console.log('[Auth] Session nettoyée');
}
