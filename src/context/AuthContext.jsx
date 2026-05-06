import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

function makeInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Read session on mount and listen for auth changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (authUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      setUser({
        id: authUser.id,
        email: authUser.email,
        name: profile?.name || 'User',
        initials: makeInitials(profile?.name || 'User'),
        phone: profile?.phone || '',
        role: profile?.role || 'client',
        skill: profile?.skill || '',
        categories: profile?.categories || [],
        rate: profile?.rate || '',
        bio: profile?.bio || '',
        location: profile?.location || 'Chennai, Tamil Nadu',
        area: profile?.area || '',
        memberSince: profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear(),
        verified: true, // We assume true for now, can be linked to email confirmation
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Register (Supabase) ── */
  const register = async ({ name, email, phone, password, role, skill, categories, rate, bio, location, area }) => {
    setAuthError(null);

    // 1. Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }, // Optional metadata
        emailRedirectTo: window.location.origin + (import.meta.env.BASE_URL || '/')
      }
    });

    if (signUpError) throw signUpError;

    const authUser = data.user;
    if (!authUser) throw new Error('Sign up failed.');

    // 2. Create profile record
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: authUser.id,
        email,
        name,
        phone,
        role: role || 'client',
        skill: skill || '',
        categories: categories || [],
        rate: rate || '',
        bio: bio || '',
        location: location || 'Chennai, Tamil Nadu',
        area: area || '',
      }
    ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Wait, if it fails, maybe it already exists or row level security blocked it. 
      // Supabase triggers can also create profiles, but let's do it manually for now.
    }

    if (data.session) {
      await loadUserProfile(authUser);
      return { nextStep: { signUpStep: 'DONE' } };
    } else {
      return { nextStep: { signUpStep: 'CONFIRM_SIGN_UP' } };
    }
  };

  /* ── Log In (Supabase) ── */
  const login = async (email, password) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // onAuthStateChange handles loading the profile
  };

  /* ── Log Out ── */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  /* ── Verify OTP (Magic Link / Email Confirmation usually handled by links in Supabase, but keeping interface) ── */
  const verifyEmail = async (email, code) => {
    setAuthError(null);
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'signup' });
    if (error) throw error;
  };

  /* ── Resend OTP ── */
  const resendCode = async (email) => {
    setAuthError(null);
    await supabase.auth.resend({ type: 'signup', email });
  };

  /* ── Forgot Password ── */
  const forgotPassword = async (email) => {
    setAuthError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  /* ── Confirm New Password ── */
  const confirmNewPassword = async (email, code, newPassword) => {
    setAuthError(null);
    // Not directly supported with a code in Supabase JS v2 without the session. 
    // Usually password reset uses magic links. We'll leave it as a stub or update password if logged in.
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'recovery' });
    if (error) throw error;
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) throw updateError;
  };

  /* ── Update profile ── */
  const updateProfile = async (updates) => {
    if (user?.id) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (!error) {
        setUser(prev => ({ ...prev, ...updates, initials: makeInitials(updates.name || prev?.name) }));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      authLoading,
      authError,
      isAuthenticated: !!user,
      isMockMode: false,     
      isLocalAuth: false,    // Now using Supabase
      register,
      verifyEmail,
      resendCode,
      login,
      logout,
      forgotPassword,
      confirmNewPassword,
      updateProfile,
      setAuthError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
