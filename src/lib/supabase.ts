import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

const serverUrl = `${supabaseUrl}/functions/v1/make-server-643544a8`;

export const api = {
  async signup(data: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone: string;
    binome: string;
  }) {
    const response = await fetch(`${serverUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  async getProfile(accessToken: string) {
    const response = await fetch(`${serverUrl}/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log('API getProfile response:', data);
    if (!response.ok) {
      console.error('Profile fetch error:', response.status, data);
    }
    return data;
  },

  async declarePresence(accessToken: string, validationType: string) {
    const response = await fetch(`${serverUrl}/presence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ validationType }),
    });
    return response.json();
  },

  async getTodayStatus(accessToken: string) {
    const response = await fetch(`${serverUrl}/status/today`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  async declareAbsence(accessToken: string, data: {
    motif: string;
    dateDebut: string;
    dateFin: string;
    commentaire: string;
  }) {
    const response = await fetch(`${serverUrl}/absence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getHistory(accessToken: string) {
    const response = await fetch(`${serverUrl}/history`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  async getBinomeStatus(accessToken: string) {
    const response = await fetch(`${serverUrl}/binome/status`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
};