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
    console.log('Auth error: Missing authorization header');
    return { user: null, error: 'Missing authorization header' };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Auth error: Invalid authorization header format');
    return { user: null, error: 'Invalid authorization header' };
  }

  console.log('Attempting to verify token, length:', token.length);
  
  // Verify the JWT token
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error) {
    console.log('JWT verification error:', error.message, error);
  } else {
    console.log('JWT verified successfully, user ID:', user?.id);
  }
  
  return { user, error };
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

Deno.serve(app.fetch);