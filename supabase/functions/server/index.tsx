import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Sign up route
app.post('/make-server-643544a8/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, nom, prenom, telephone, binome } = body;

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
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
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Profile auth error: ${authError?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    
    if (!userData) {
      return c.json({ error: 'Profil introuvable' }, 404);
    }

    return c.json({
      id: user.id,
      email: user.email,
      ...userData,
    });
  } catch (error) {
    console.log(`Get profile error: ${error}`);
    return c.json({ error: 'Erreur lors de la récupération du profil' }, 500);
  }
});

// Declare presence
app.post('/make-server-643544a8/presence', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Presence declaration auth error: ${authError?.message}`);
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
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Get today status auth error: ${authError?.message}`);
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
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Absence declaration auth error: ${authError?.message}`);
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { motif, dateDebut, dateFin, commentaire } = body;

    const absenceId = `absence:${user.id}:${Date.now()}`;
    const absenceData = {
      userId: user.id,
      motif,
      dateDebut,
      dateFin,
      commentaire,
      createdAt: new Date().toISOString(),
    };

    await kv.set(absenceId, absenceData);
    
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
      message: 'Absence déclarée avec succès',
      data: absenceData,
    });
  } catch (error) {
    console.log(`Declare absence error: ${error}`);
    return c.json({ error: 'Erreur lors de la déclaration d\'absence' }, 500);
  }
});

// Get presence history
app.get('/make-server-643544a8/history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Get history auth error: ${authError?.message}`);
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
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Get binome status auth error: ${authError?.message}`);
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

Deno.serve(app.fetch);
