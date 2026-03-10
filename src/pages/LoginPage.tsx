import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      register(name, email, phone, password, role);
    } else {
      login(email, password, role);
    }
    if (role === 'admin') navigate('/admin');
    else if (role === 'seller') navigate('/seller');
    else navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-sm px-4">
          <h1 className="section-title text-center mb-6">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <>
                <input className="input-field" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <input className="input-field" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
              </>
            )}
            <input className="input-field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

            {/* Role selector */}
            <div>
              <label className="text-xs text-muted-foreground font-display block mb-1.5">Login as</label>
              <div className="flex gap-2">
                {(['customer', 'seller', 'admin'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-1.5 text-xs font-display font-medium rounded-sm border transition-colors ${
                      role === r ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                    }`}
                  >
                    {r === 'customer' ? 'Customer' : r === 'seller' ? 'Seller' : 'Admin'}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-cart w-full mt-2">
              {isRegister ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsRegister(!isRegister)} className="text-buoy-orange font-semibold hover:underline">
              {isRegister ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
