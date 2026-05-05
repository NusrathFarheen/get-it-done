import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signIn, signOut, signUp, confirmSignUp,
  getCurrentUser, fetchUserAttributes, resendSignUpCode,
  resetPassword, confirmResetPassword,
} from 'aws-amplify/auth';
import { isCognitoConfigured } from '../amplify-config';

// ─── LocalStorage-backed user store (used when Cognito isn't live yet) ────────
// Each account is stored as: gid_users → { [email]: { ...profile } }
// Current session: gid_session → email of logged-in user

const STORE_KEY = 'gid_users';
const SESSION_KEY = 'gid_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; }
}
function saveUsers(users) {
  localStorage.setItem(STORE_KEY, JSON.stringify(users));
}
function getSession() {
  return localStorage.getItem(SESSION_KEY);
}
function saveSession(email) {
  if (email) localStorage.setItem(SESSION_KEY, email);
  else localStorage.removeItem(SESSION_KEY);
}

function makeInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function profileFromStored(stored) {
  return {
    id: stored.id,
    name: stored.name,
    initials: makeInitials(stored.name),
    email: stored.email,
    phone: stored.phone || '',
    role: stored.role || 'client',
    skill: stored.skill || '',
    categories: stored.categories || [],
    rate: stored.rate || '',
    bio: stored.bio || '',
    location: stored.location || 'Chennai, Tamil Nadu',
    area: stored.area || '',
    memberSince: stored.memberSince || new Date().getFullYear(),
    verified: stored.verified || false,
  };
}

// ─── Is Cognito actually configured? ─────────────────────────────────────────
// We use localStorage auth whenever Cognito isn't wired up.
const USE_LOCAL_AUTH = !isCognitoConfigured();
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // On mount — restore session from localStorage OR Cognito
  useEffect(() => {
    if (USE_LOCAL_AUTH) {
      const email = getSession();
      if (email) {
        const users = getUsers();
        const stored = users[email];
        if (stored) {
          setUser(profileFromStored(stored));
        }
      }
      setAuthLoading(false);
      return;
    }

    // Real Cognito path
    getCurrentUser()
      .then(() => fetchUserAttributes())
      .then(attrs => {
        setUser({
          id: attrs.sub,
          name: attrs.name || 'User',
          initials: makeInitials(attrs.name),
          email: attrs.email,
          phone: attrs.phone_number || '',
          role: attrs['custom:role'] || 'client',
          skill: attrs['custom:skill'] || '',
          categories: [],
          rate: attrs['custom:rate'] || '',
          bio: attrs['custom:bio'] || '',
          location: attrs['custom:location'] || '',
          memberSince: new Date().getFullYear(),
          verified: attrs.email_verified === 'true',
        });
      })
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  /* ── Register (localStorage or Cognito) ── */
  const register = async ({ name, email, phone, password, role, skill, categories, rate, bio, location, area }) => {
    setAuthError(null);

    if (USE_LOCAL_AUTH) {
      const users = getUsers();
      if (users[email]) {
        throw new Error('An account with this email already exists. Try logging in.');
      }
      const newUser = {
        id: `local-${Date.now()}`,
        name, email, phone, password, // stored for local auth only
        role: role || 'client',
        skill: skill || '',
        categories: categories || [],
        rate: rate || '',
        bio: bio || '',
        location: location || 'Chennai, Tamil Nadu',
        area: area || '',
        memberSince: new Date().getFullYear(),
        verified: true, // auto-verify in local mode
      };
      users[email] = newUser;
      saveUsers(users);
      saveSession(email);
      setUser(profileFromStored(newUser));
      return { nextStep: { signUpStep: 'DONE' } };
    }

    // Real Cognito
    const customAttributes = { 'custom:role': role };
    if (skill) customAttributes['custom:skill'] = skill;
    if (rate) customAttributes['custom:rate'] = String(rate);
    if (bio) customAttributes['custom:bio'] = bio;
    if (location) customAttributes['custom:location'] = location;

    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          name,
          email,
          phone_number: phone ? `+91${phone.replace(/\D/g, '').slice(-10)}` : undefined,
          ...customAttributes,
        },
      },
    });
    return result;
  };

  /* ── Log In (localStorage or Cognito) ── */
  const login = async (email, password) => {
    setAuthError(null);

    if (USE_LOCAL_AUTH) {
      const users = getUsers();
      const stored = users[email];
      if (!stored) throw new Error('No account found with this email. Please sign up first.');
      if (stored.password !== password) throw new Error('Incorrect password. Please try again.');
      saveSession(email);
      setUser(profileFromStored(stored));
      return;
    }

    // Real Cognito
    await signIn({ username: email, password });
    const attrs = await fetchUserAttributes();
    setUser({
      id: attrs.sub,
      name: attrs.name || 'User',
      initials: makeInitials(attrs.name),
      email: attrs.email,
      phone: attrs.phone_number || '',
      role: attrs['custom:role'] || 'client',
      skill: attrs['custom:skill'] || '',
      categories: [],
      rate: attrs['custom:rate'] || '',
      bio: attrs['custom:bio'] || '',
      location: attrs['custom:location'] || '',
      memberSince: new Date().getFullYear(),
      verified: attrs.email_verified === 'true',
    });
  };

  /* ── Log Out ── */
  const logout = async () => {
    if (!USE_LOCAL_AUTH) await signOut();
    saveSession(null);
    setUser(null);
  };

  /* ── Verify OTP (only needed for real Cognito) ── */
  const verifyEmail = async (email, code) => {
    setAuthError(null);
    if (USE_LOCAL_AUTH) return; // auto-verified in local mode
    await confirmSignUp({ username: email, confirmationCode: code });
  };

  /* ── Resend OTP ── */
  const resendCode = async (email) => {
    setAuthError(null);
    if (!USE_LOCAL_AUTH) await resendSignUpCode({ username: email });
  };

  /* ── Forgot Password ── */
  const forgotPassword = async (email) => {
    setAuthError(null);
    if (!USE_LOCAL_AUTH) await resetPassword({ username: email });
  };

  /* ── Confirm New Password ── */
  const confirmNewPassword = async (email, code, newPassword) => {
    setAuthError(null);
    if (!USE_LOCAL_AUTH) await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
  };

  /* ── Update profile (for workers completing their profile) ── */
  const updateProfile = (updates) => {
    if (USE_LOCAL_AUTH && user?.email) {
      const users = getUsers();
      if (users[user.email]) {
        users[user.email] = { ...users[user.email], ...updates };
        saveUsers(users);
      }
    }
    setUser(prev => ({ ...prev, ...updates, initials: makeInitials(updates.name || prev?.name) }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      authLoading,
      authError,
      isAuthenticated: !!user,
      isMockMode: false,     // no longer using a hard-coded mock user
      isLocalAuth: USE_LOCAL_AUTH,
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
