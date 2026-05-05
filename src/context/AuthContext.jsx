import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signIn, signOut, signUp, confirmSignUp,
  getCurrentUser, fetchUserAttributes, resendSignUpCode,
  resetPassword, confirmResetPassword,
} from 'aws-amplify/auth';
import { isCognitoConfigured } from '../amplify-config';

// ─── Fallback mock user when Cognito isn't configured yet ───────────────────
const MOCK_USER = {
  id: 'mock-001',
  name: 'Ananya Iyer',
  initials: 'AI',
  email: 'ananya@example.com',
  phone: '+91 9876543210',
  role: 'client',        // change to 'worker' to preview worker dashboard
  location: 'Mumbai, Maharashtra',
  memberSince: 2024,
  verified: true,
};

/**
 * DEV_MOCK_MODE — set to true to bypass Cognito during local development.
 * This lets you navigate all pages without needing real Cognito login.
 *
 * Set to false when you want to test real Cognito sign-up / login.
 * ⚠️ Always set to false before deploying to production.
 */
const DEV_MOCK_MODE = true;
// ────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

function makeInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // On mount — check if there is an existing Cognito session
  useEffect(() => {
    if (DEV_MOCK_MODE || !isCognitoConfigured()) {
      // Dev mode or not configured → use mock user so all pages work freely
      setUser(MOCK_USER);
      setAuthLoading(false);
      return;
    }

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

  /* ── Sign Up ── */
  const register = async ({ name, email, phone, password, role, skill, rate, bio, location }) => {
    setAuthError(null);
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
    return result; // caller checks result.nextStep.signUpStep === 'CONFIRM_SIGN_UP'
  };

  /* ── Verify OTP ── */
  const verifyEmail = async (email, code) => {
    setAuthError(null);
    await confirmSignUp({ username: email, confirmationCode: code });
  };

  /* ── Resend OTP ── */
  const resendCode = async (email) => {
    setAuthError(null);
    await resendSignUpCode({ username: email });
  };

  /* ── Log In ── */
  const login = async (email, password) => {
    setAuthError(null);
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
      rate: attrs['custom:rate'] || '',
      bio: attrs['custom:bio'] || '',
      location: attrs['custom:location'] || '',
      memberSince: new Date().getFullYear(),
      verified: attrs.email_verified === 'true',
    });
  };

  /* ── Log Out ── */
  const logout = async () => {
    if (isCognitoConfigured()) await signOut();
    setUser(null);
  };

  /* ── Forgot Password ── */
  const forgotPassword = async (email) => {
    setAuthError(null);
    await resetPassword({ username: email });
  };

  /* ── Confirm New Password ── */
  const confirmNewPassword = async (email, code, newPassword) => {
    setAuthError(null);
    await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
  };

  return (
    <AuthContext.Provider value={{
      user,
      authLoading,
      authError,
      isAuthenticated: !!user,
      isMockMode: DEV_MOCK_MODE || !isCognitoConfigured(),
      register,
      verifyEmail,
      resendCode,
      login,
      logout,
      forgotPassword,
      confirmNewPassword,
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
