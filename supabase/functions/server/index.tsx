import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Client with Service Role Key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client with Anon Key for verifying user tokens
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get authenticated user from request
async function getAuthenticatedUser(authHeader: string | undefined) {
  if (!authHeader) {
    console.log('❌ Auth error: Missing authorization header');
    return { user: null, error: 'Missing authorization header' };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('❌ Auth error: Invalid authorization header format');
    return { user: null, error: 'Invalid authorization header' };
  }

  console.log('🔍 Attempting to verify token...');
  console.log('   Token length:', token.length);
  console.log('   Token preview:', token.substring(0, 20) + '...');

  // Verify the JWT token
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    console.log('❌ JWT verification error:', error.message);
    console.log('   Error details:', JSON.stringify(error, null, 2));
  } else if (user) {
    console.log('✅ JWT verified successfully!');
    console.log('   User ID:', user.id);
    console.log('   User email:', user.email);
  } else {
    console.log('⚠️ No user returned, but no error either');
  }

  return { user, error };
}

// Types de rôles hiérarchiques
type UserRole = 'moderateur' | 'superadmin' | 'admin' | 'user';

// Hiérarchie des rôles (du plus élevé au plus bas)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  moderateur: 4,
  superadmin: 3,
  admin: 2,
  user: 1,
};

// Vérifier si un rôle peut gérer un autre rôle
function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
}

// Helper pour vérifier le rôle d'un utilisateur
async function getUserRole(userId: string): Promise<UserRole> {
  const userData = await kv.get(`user:${userId}`);
  const role = userData?.role || 'user';
  console.log(`getUserRole for ${userId}: ${role}`, userData ? 'Data found' : 'No data found');
  return role;
}

// Middleware pour vérifier le rôle minimum requis
async function requireRole(authHeader: string | undefined, minRole: UserRole) {
  const { user, error } = await getAuthenticatedUser(authHeader);

  if (!user?.id || error) {
    console.log('requireRole: Authentication failed', error);
    return { authorized: false, user: null, error: 'Non autorisé' };
  }

  console.log(`requireRole: Checking role for user ${user.id}, required: ${minRole}`);

  const userRole = await getUserRole(user.id);

  console.log(`requireRole: User role is ${userRole}, hierarchy level: ${ROLE_HIERARCHY[userRole]}, required level: ${ROLE_HIERARCHY[minRole]}`);

  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minRole]) {
    console.log(`requireRole: Access denied. User role ${userRole} < required role ${minRole}`);
    return {
      authorized: false,
      user: null,
      error: `Rôle ${minRole} ou supérieur requis. Votre rôle: ${userRole}`
    };
  }

  console.log(`requireRole: Access granted for user ${user.id} with role ${userRole}`);
  return { authorized: true, user, userRole, error: null };
}

// Sign up route
app.post('/make-server-643544a8/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, nom, prenom, telephone, binome } = body;

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { nom, prenom },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (authError) {
      console.log(`Sign up auth error: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional user data in KV store
    const userId = authData.user.id;
    await kv.set(`user:${userId}`, {
      userId,  // Ajouter userId pour faciliter la récupération
      nom,
      prenom,
      email,
      telephone,
      binome,
      createdAt: new Date().toISOString(),
    });

    return c.json({
      success: true,
      userId,
      message: 'Utilisateur créé avec succès'
    });
  } catch (error) {
    console.log(`Sign up error: ${error}`);
    return c.json({ error: 'Erreur lors de la création du compte' }, 500);
  }
});

// Get user profile
app.get('/make-server-643544a8/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log(`Profile auth error: ${error?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    console.log('User authenticated, ID:', user.id);
    const userData = await kv.get(`user:${user.id}`);
    console.log('User data from KV:', userData);

    if (!userData) {
      console.log('User data not found in KV store for user:', user.id);
      return c.json({ error: 'Profil introuvable' }, 404);
    }

    const response = {
      id: user.id,
      email: user.email,
      ...userData,
    };
    console.log('Sending profile response:', response);
    return c.json(response);
  } catch (error) {
    console.log(`Get profile error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération du profil' }, 500);
  }
});

// Declare presence
app.post('/make-server-643544a8/presence', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log(`Presence declaration auth error: ${error?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { validationType } = body; // 'biometric' or 'code'

    const presenceId = `presence:${user.id}:${new Date().toISOString().split('T')[0]}`;
    const presenceData = {
      userId: user.id,
      date: new Date().toISOString(),
      validationType,
      status: 'present',
    };

    await kv.set(presenceId, presenceData);

    // Update today's status
    await kv.set(`status:${user.id}:today`, {
      status: 'present',
      timestamp: new Date().toISOString(),
    });

    return c.json({
      success: true,
      message: 'Présence enregistrée avec succès',
      data: presenceData,
    });
  } catch (error) {
    console.log(`Declare presence error: ${error}`);
    return c.json({ error: 'Erreur lors de la déclaration de présence' }, 500);
  }
});

// Get today's status
app.get('/make-server-643544a8/status/today', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log(`Get today status auth error: ${error?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const status = await kv.get(`status:${user.id}:today`);

    return c.json({
      status: status?.status || 'not_declared',
      timestamp: status?.timestamp || null,
    });
  } catch (error) {
    console.log(`Get today status error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération du statut' }, 500);
  }
});

// Declare absence
app.post('/make-server-643544a8/absence', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log(`Absence declaration auth error: ${error?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { motif, dateDebut, dateFin, commentaire, nouveauBinomeId } = body;

    const absenceId = `absence:${user.id}:${Date.now()}`;
    const absenceData = {
      userId: user.id,
      motif,
      dateDebut,
      dateFin,
      commentaire,
      nouveauBinomeId: nouveauBinomeId || null,
      createdAt: new Date().toISOString(),
    };

    await kv.set(absenceId, absenceData);

    // Si un nouveau binôme est assigné, mettre à jour l'ancien binôme
    if (nouveauBinomeId) {
      const userData = await kv.get(`user:${user.id}`);
      const ancienBinome = userData?.binome;

      if (ancienBinome) {
        // Enregistrer la réaffectation temporaire
        await kv.set(`binome:reassignment:${ancienBinome}:${Date.now()}`, {
          ancienPartenaire: user.id,
          nouveauPartenaire: nouveauBinomeId,
          dateDebut,
          dateFin,
          raison: `Absence de ${userData?.nom} ${userData?.prenom}`,
          createdAt: new Date().toISOString(),
        });

        console.log(`Réaffectation de binôme: ${ancienBinome} → ${nouveauBinomeId}`);
      }
    }

    // Update today's status if absence starts today
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(dateDebut).toISOString().split('T')[0];

    if (startDate === today) {
      await kv.set(`status:${user.id}:today`, {
        status: 'absent',
        timestamp: new Date().toISOString(),
        motif,
      });
    }

    return c.json({
      success: true,
      message: nouveauBinomeId
        ? 'Absence déclarée avec réaffectation de binôme'
        : 'Absence déclarée avec succès',
      data: absenceData,
    });
  } catch (error) {
    console.log(`Declare absence error: ${error}`);
    return c.json({ error: 'Erreur lors de la déclaration d\'absence' }, 500);
  }
});

// Get available agents for binome reassignment
app.get('/make-server-643544a8/agents/available', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log(`Get available agents auth error: ${error?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    // Récupérer tous les utilisateurs
    const allUsers = await kv.getByPrefix('user:');

    // Filtrer pour ne garder que les agents disponibles (pas l'utilisateur actuel)
    const availableAgents = allUsers
      .filter(agent => agent.userId !== user.id)
      .map(agent => ({
        id: agent.userId || '',
        nom: agent.nom || '',
        prenom: agent.prenom || '',
        email: agent.email || '',
        binome: agent.binome || '',
      }));

    return c.json({
      agents: availableAgents,
      total: availableAgents.length,
    });
  } catch (error) {
    console.log(`Get available agents error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération des agents' }, 500);
  }
});

// Get binome reassignments
app.get('/make-server-643544a8/binome/reassignments', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log(`Get binome reassignments auth error: ${error?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    const binome = userData?.binome;

    if (!binome) {
      return c.json({ reassignments: [] });
    }

    // Récupérer toutes les réaffectations pour ce binôme
    const reassignments = await kv.getByPrefix(`binome:reassignment:${binome}:`);

    return c.json({
      reassignments: reassignments.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      }),
    });
  } catch (error) {
    console.log(`Get binome reassignments error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération des réaffectations' }, 500);
  }
});

// Get presence history
app.get('/make-server-643544a8/history', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log(`Get history auth error: ${error?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    // Get all presence records for this user
    const presenceRecords = await kv.getByPrefix(`presence:${user.id}:`);
    const absenceRecords = await kv.getByPrefix(`absence:${user.id}:`);

    // Combine and sort by date
    const allRecords = [
      ...presenceRecords.map(r => ({ ...r, type: 'presence' })),
      ...absenceRecords.map(r => ({ ...r, type: 'absence' })),
    ].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt).getTime();
      const dateB = new Date(b.date || b.createdAt).getTime();
      return dateB - dateA; // Most recent first
    });

    return c.json({
      records: allRecords.slice(0, 10), // Return last 10 records
    });
  } catch (error) {
    console.log(`Get history error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération de l\'historique' }, 500);
  }
});

// Get binome status
app.get('/make-server-643544a8/binome/status', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log(`Get binome status auth error: ${error?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);

    if (!userData?.binome) {
      return c.json({ binome: null });
    }

    // This is simplified - in a real app, you'd look up the binome user by their ID
    return c.json({
      binome: {
        name: userData.binome,
        status: 'present', // Mock status
      },
    });
  } catch (error) {
    console.log(`Get binome status error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération du statut du binôme' }, 500);
  }
});

// Liste TOUS les utilisateurs (pour sélection de binôme lors de l'inscription)
// Route publique (pas d'auth requise) pour permettre la sélection de binôme
app.get('/make-server-643544a8/users/all', async (c) => {
  try {
    console.log('Getting all users for binome selection');

    // Récupérer tous les utilisateurs
    const allUsers = await kv.getByPrefix('user:');

    console.log(`Found ${allUsers.length} users in KV store`);

    // Formater les données pour le frontend
    const users = allUsers.map(user => ({
      id: user.userId || '',
      nom: user.nom || '',
      prenom: user.prenom || '',
      fullName: `${user.prenom || ''} ${user.nom || ''}`.trim(),
    }));

    return c.json({
      users,
      total: users.length,
    });
  } catch (error) {
    console.log(`Get all users error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération des utilisateurs' }, 500);
  }
});

// ========================================
// ROUTES DE GESTION DES MODÉRATEURS/ADMINS
// ========================================

// Email de l'administrateur principal
const PRIMARY_ADMIN_EMAIL = 'joachimgoehakue05@gmail.com';

// Route pour inscription admin (public - permet de créer le premier admin)
app.post('/make-server-643544a8/admin/signup', async (c) => {
  try {
    console.log('=== ADMIN SIGNUP ROUTE CALLED ===');

    const body = await c.req.json();
    console.log('Request body received:', {
      email: body.email,
      nom: body.nom,
      prenom: body.prenom,
      telephone: body.telephone,
      hasPassword: !!body.password
    });

    const { email, password, nom, prenom, telephone } = body;

    // Validation des champs requis
    if (!email || !password || !nom || !prenom || !telephone) {
      console.log('Missing required fields');
      return c.json({
        error: 'Tous les champs sont requis (email, password, nom, prenom, telephone)'
      }, 400);
    }

    // Vérifier si des admins existent déjà
    console.log('Checking existing admins...');
    const allUsers = await kv.getByPrefix('user:');
    console.log(`Found ${allUsers.length} total users`);

    const existingAdmins = allUsers.filter(user =>
      user.role && ['admin', 'superadmin', 'moderateur'].includes(user.role)
    );
    console.log(`Found ${existingAdmins.length} existing admins`);

    // Déterminer le rôle à assigner
    let role: UserRole = 'admin';

    // Si c'est l'email principal, toujours faire modérateur
    if (email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      role = 'moderateur';
      console.log(`PRIMARY ADMIN EMAIL detected: ${email} → assigning role: ${role}`);
    }
    // Si aucun admin n'existe, le premier devient modérateur
    else if (existingAdmins.length === 0) {
      role = 'moderateur';
      console.log(`First admin: ${email} → assigning role: ${role}`);
    } else {
      console.log(`Regular admin: ${email} → assigning role: ${role}`);
    }

    // Créer le compte Supabase
    console.log('Creating Supabase user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { nom, prenom, role },
      email_confirm: true,
    });

    if (authError) {
      console.error(`Admin signup auth error: ${authError.message}`);
      return c.json({ error: `Erreur d'authentification: ${authError.message}` }, 400);
    }

    if (!authData || !authData.user) {
      console.error('No user data returned from Supabase');
      return c.json({ error: 'Erreur lors de la création du compte (pas de données utilisateur)' }, 500);
    }

    const adminId = authData.user.id;
    console.log(`Supabase user created successfully: ${adminId}`);

    // Stocker les données administrateur
    console.log('Storing admin data in KV store...');
    await kv.set(`user:${adminId}`, {
      userId: adminId,
      nom,
      prenom,
      email,
      telephone,
      role,
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Admin créé avec succès: ${email} avec rôle ${role}`);

    return c.json({
      success: true,
      userId: adminId,
      role,
      message: `Compte administrateur créé avec succès (${role})`,
    });
  } catch (error) {
    console.error(`❌ Admin signup error:`, error);
    return c.json({
      error: 'Erreur lors de la création du compte administrateur',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Créer un compte admin/modérateur (nécessite rôle admin minimum)
app.post('/make-server-643544a8/admin/create', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { authorized, user, userRole, error } = await requireRole(authHeader, 'admin');

    if (!authorized || !user) {
      console.log(`Create admin auth error: ${error}`);
      return c.json({ error }, 401);
    }

    const body = await c.req.json();
    const { email, password, nom, prenom, telephone, role, linkToUserId } = body;

    // Vérifier que le créateur peut créer ce rôle
    if (!canManageRole(userRole as UserRole, role)) {
      return c.json({
        error: `Vous ne pouvez pas créer un compte avec le rôle ${role}. Votre rôle: ${userRole}`
      }, 403);
    }

    // Créer le compte Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { nom, prenom, role },
      email_confirm: true,
    });

    if (authError) {
      console.log(`Create admin auth error: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    const adminId = authData.user.id;

    // Stocker les données administrateur
    await kv.set(`user:${adminId}`, {
      userId: adminId,
      nom,
      prenom,
      email,
      telephone,
      role,
      linkedUserId: linkToUserId || null, // Lier à un compte utilisateur existant si demandé
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    });

    console.log(`Admin/Modérateur créé: ${email} avec rôle ${role} par ${userRole}`);

    return c.json({
      success: true,
      adminId,
      message: `Compte ${role} créé avec succès`,
    });
  } catch (error) {
    console.log(`Create admin error: ${error}`);
    return c.json({ error: 'Erreur lors de la création du compte admin' }, 500);
  }
});

// Lister tous les modérateurs/admins (nécessite rôle admin minimum)
app.get('/make-server-643544a8/admin/list', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { authorized, error } = await requireRole(authHeader, 'admin');

    if (!authorized) {
      console.log(`List admins auth error: ${error}`);
      return c.json({ error }, 401);
    }

    // Récupérer tous les utilisateurs
    const allUsers = await kv.getByPrefix('user:');

    // Filtrer pour ne garder que les admins/modérateurs
    const admins = allUsers
      .filter(user => user.role && user.role !== 'user')
      .map(admin => ({
        id: admin.userId || '',
        nom: admin.nom || '',
        prenom: admin.prenom || '',
        email: admin.email || '',
        telephone: admin.telephone || '',
        role: admin.role || 'user',
        linkedUserId: admin.linkedUserId || null,
        createdAt: admin.createdAt || '',
      }))
      .sort((a, b) => {
        // Trier par hiérarchie de rôle
        return ROLE_HIERARCHY[b.role as UserRole] - ROLE_HIERARCHY[a.role as UserRole];
      });

    return c.json({
      admins,
      total: admins.length,
      breakdown: {
        moderateur: admins.filter(a => a.role === 'moderateur').length,
        superadmin: admins.filter(a => a.role === 'superadmin').length,
        admin: admins.filter(a => a.role === 'admin').length,
      },
    });
  } catch (error) {
    console.log(`List admins error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération des administrateurs' }, 500);
  }
});

// Modifier le rôle d'un admin (seul modérateur peut tout faire)
app.put('/make-server-643544a8/admin/change-role/:targetUserId', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { authorized, user, userRole, error } = await requireRole(authHeader, 'admin');

    if (!authorized || !user) {
      console.log(`Change role auth error: ${error}`);
      return c.json({ error }, 401);
    }

    const targetUserId = c.req.param('targetUserId');
    const { newRole } = await c.req.json();

    // Récupérer l'utilisateur cible
    const targetUser = await kv.get(`user:${targetUserId}`);

    if (!targetUser) {
      return c.json({ error: 'Utilisateur non trouvé' }, 404);
    }

    const currentTargetRole = targetUser.role || 'user';

    // Vérifier les permissions
    // 1. Peut-on gérer le rôle actuel de la cible ?
    if (!canManageRole(userRole as UserRole, currentTargetRole)) {
      return c.json({
        error: `Vous ne pouvez pas modifier cet utilisateur (rôle: ${currentTargetRole})`
      }, 403);
    }

    // 2. Peut-on attribuer le nouveau rôle ?
    if (!canManageRole(userRole as UserRole, newRole)) {
      return c.json({
        error: `Vous ne pouvez pas attribuer le rôle ${newRole}`
      }, 403);
    }

    // Mettre à jour le rôle
    await kv.set(`user:${targetUserId}`, {
      ...targetUser,
      role: newRole,
      roleChangedBy: user.id,
      roleChangedAt: new Date().toISOString(),
    });

    console.log(`Rôle modifié: ${targetUserId} de ${currentTargetRole} à ${newRole} par ${userRole}`);

    return c.json({
      success: true,
      message: `Rôle modifié de ${currentTargetRole} à ${newRole}`,
    });
  } catch (error) {
    console.log(`Change role error: ${error}`);
    return c.json({ error: 'Erreur lors de la modification du rôle' }, 500);
  }
});

// Supprimer un admin (seul modérateur ou supérieur peut supprimer)
app.delete('/make-server-643544a8/admin/delete/:targetUserId', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { authorized, user, userRole, error } = await requireRole(authHeader, 'admin');

    if (!authorized || !user) {
      console.log(`Delete admin auth error: ${error}`);
      return c.json({ error }, 401);
    }

    const targetUserId = c.req.param('targetUserId');

    // Récupérer l'utilisateur cible
    const targetUser = await kv.get(`user:${targetUserId}`);

    if (!targetUser) {
      return c.json({ error: 'Utilisateur non trouvé' }, 404);
    }

    const targetRole = targetUser.role || 'user';

    // Vérifier qu'on peut supprimer cet utilisateur
    if (!canManageRole(userRole as UserRole, targetRole)) {
      return c.json({
        error: `Vous ne pouvez pas supprimer cet utilisateur (rôle: ${targetRole})`
      }, 403);
    }

    // Ne pas se supprimer soi-même
    if (targetUserId === user.id) {
      return c.json({ error: 'Vous ne pouvez pas vous supprimer vous-même' }, 400);
    }

    // Supprimer de Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

    if (deleteError) {
      console.log(`Delete user from auth error: ${deleteError.message}`);
    }

    // Supprimer du KV Store
    await kv.del(`user:${targetUserId}`);

    console.log(`Admin supprimé: ${targetUserId} (rôle: ${targetRole}) par ${userRole}`);

    return c.json({
      success: true,
      message: 'Administrateur supprimé avec succès',
    });
  } catch (error) {
    console.log(`Delete admin error: ${error}`);
    return c.json({ error: 'Erreur lors de la suppression de l\'administrateur' }, 500);
  }
});

// Manual role fix endpoint (for fixing role issues without recreating account)
app.post('/make-server-643544a8/fix-my-role', async (c) => {
  try {
    console.log('=== FIX MY ROLE ENDPOINT CALLED ===');

    const authHeader = c.req.header('Authorization');
    const { user, error } = await getAuthenticatedUser(authHeader);

    if (!user?.id || error) {
      console.log('❌ Authentication failed:', error);
      return c.json({ error: 'Non autorisé - Vous devez être connecté' }, 401);
    }

    console.log('✅ User authenticated:', user.id, user.email);

    // Check if this is the primary admin email
    if (user.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      console.log('✅ Primary admin email detected, fixing role...');

      // Get existing user data
      const userData = await kv.get(`user:${user.id}`);
      console.log('Current user data:', userData);

      // Update with moderateur role
      await kv.set(`user:${user.id}`, {
        ...userData,
        userId: user.id,
        email: user.email,
        role: 'moderateur',
        roleFixedAt: new Date().toISOString(),
      });

      console.log('✅ Role updated to moderateur for:', user.email);

      return c.json({
        success: true,
        message: 'Votre rôle a été mis à jour en modérateur',
        newRole: 'moderateur',
        userId: user.id
      });
    } else {
      console.log('❌ Not primary admin email:', user.email);
      return c.json({
        error: `Seul le compte principal (${PRIMARY_ADMIN_EMAIL}) peut utiliser cette fonction`
      }, 403);
    }
  } catch (error) {
    console.error('❌ Fix role error:', error);
    return c.json({
      error: 'Erreur lors de la mise à jour du rôle',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);