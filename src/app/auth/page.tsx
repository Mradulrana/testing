'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import styles from './Auth.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.push('/');
      } else {
        // Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone_number: phoneNumber,
              user_role: role,
            }
          }
        });

        if (authError) throw authError;

        alert("Registration successful! Please sign in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred with Google login.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgDecoration}></div>

      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Home className="w-6 h-6" />
            </div>
            <span className={styles.logoText}>
              Zameen<span className={styles.logoHighlight}>Market</span>
            </span>
          </Link>
        </div>
        <h2 className={styles.title}>
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className={styles.subtitle}>
          {isLogin ? 'Sign in to access your saved properties' : 'Join thousands of users finding their dream homes'}
        </p>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formCard}>

          <div className={styles.tabs}>
            <button
              onClick={() => setIsLogin(true)}
              className={`${styles.tab} ${isLogin ? styles.tabActive : styles.tabInactive}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`${styles.tab} ${!isLogin ? styles.tabActive : styles.tabInactive}`}
            >
              Register
            </button>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                  <label className={styles.label}>I am a:</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="role" checked={role === 'buyer'} onChange={() => setRole('buyer')} /> Buyer
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="role" checked={role === 'seller'} onChange={() => setRole('seller')} /> Seller
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Full Name
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber" className={styles.label}>
                    Phone Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={styles.input}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className={styles.formOptions}>
                <div className={styles.checkboxGroup}>
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={styles.checkbox}
                  />
                  <label htmlFor="remember-me" className={styles.checkboxLabel}>
                    Remember me
                  </label>
                </div>

                <div>
                  <a href="#" className={styles.forgotPassword}>
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine}>
              <div className={styles.dividerLineInner} />
            </div>
            <div className={styles.dividerText}>
              <span className={styles.dividerTextInner}>Or continue with</span>
            </div>
          </div>

          <div className={styles.socialAuth}>
            <button type="button" onClick={handleGoogleLogin} className={styles.socialBtn}>
              <span className={styles.srOnly}>Sign in with Google</span>
              <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
