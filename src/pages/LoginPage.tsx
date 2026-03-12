import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.returnTo || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      register(name, email, phone, password);
      navigate(returnTo || '/');
    } else {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
        return;
      }
      // We need to check what role was returned — but login already sets user
      // Redirect based on role after a tick
      setTimeout(() => {
        // re-read from the auth state isn't possible here, so use hardcoded check
        if (email === 'admin@test.com') navigate(returnTo || '/admin');
        else if (email === 'seller@test.com') navigate(returnTo || '/seller');
        else navigate(returnTo || '/');
      }, 0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm px-4">
          <h1 className="section-title text-center mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-center text-sm text-muted-foreground font-body mb-6">
            {isRegister ? 'Sign up to start ordering fresh seafood' : 'Log in to your UrbanFish account'}
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-destructive font-body">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <>
                <input className="input-field rounded-lg" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <input className="input-field rounded-lg" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
              </>
            )}
            <input className="input-field rounded-lg" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="input-field rounded-lg" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

            <button type="submit" className="btn-cart w-full mt-2 rounded-lg py-3">
              {isRegister ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-4 bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-display font-medium mb-2">Test Accounts:</p>
              <div className="space-y-1 text-xs font-body text-muted-foreground">
                <p><span className="font-semibold text-foreground">Customer:</span> customer@test.com / 123456</p>
                <p><span className="font-semibold text-foreground">Seller:</span> seller@test.com / 123456</p>
                <p><span className="font-semibold text-foreground">Admin:</span> admin@test.com / 123456</p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-4">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-primary font-semibold hover:underline">
              {isRegister ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
