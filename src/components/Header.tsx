import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Urban Fish', href: '/urban-fish' },
    { label: 'Cloud Kitchen', href: '/cloud-kitchen' },
    { label: 'Stores', href: '/stores' },
    { label: 'Catch of the Day', href: '/#catch-of-the-day' },
    ...(isAuthenticated && user?.role === 'admin' ? [{ label: 'Admin', href: '/admin' }] : []),
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Urban<span className="text-buoy-orange">Fish</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link ${isActive(link.href) ? 'text-buoy-orange' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-sm hover:bg-secondary transition-colors">
            <Search className="w-4 h-4 text-foreground" />
          </button>

          <Link to="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-sm hover:bg-secondary transition-colors">
            <ShoppingCart className="w-4 h-4 text-foreground" />
            {totalItems > 0 && (
              <span className="counter-badge">{totalItems}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link
              to={user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/account'}
              className="flex items-center justify-center w-9 h-9 rounded-sm bg-secondary hover:bg-muted transition-colors"
            >
              <User className="w-4 h-4 text-foreground" />
            </Link>
          ) : (
            <Link to="/login" className="btn-cart text-sm py-1.5 px-3">
              Login
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block nav-link py-2 ${isActive(link.href) ? 'text-buoy-orange' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
