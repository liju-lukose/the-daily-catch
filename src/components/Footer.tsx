import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-deep-water text-salt-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-4">
              Urban<span className="text-buoy-orange">Fish</span>
            </h3>
            <p className="font-body text-sm text-salt-white/70 leading-relaxed">
              The freshest seafood delivered to your door. From ocean to table, we guarantee quality you can trust.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-salt-white/70">
              <li><Link to="/urban-fish" className="hover:text-buoy-orange transition-colors">Urban Fish</Link></li>
              <li><Link to="/cloud-kitchen" className="hover:text-buoy-orange transition-colors">Cloud Kitchen</Link></li>
              <li><Link to="/stores" className="hover:text-buoy-orange transition-colors">Fish Stores</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-salt-white/70">
              <li><Link to="/account" className="hover:text-buoy-orange transition-colors">My Orders</Link></li>
              <li><Link to="/account" className="hover:text-buoy-orange transition-colors">Addresses</Link></li>
              <li><Link to="/login" className="hover:text-buoy-orange transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-salt-white/70">
              <li><span>help@urbanfish.com</span></li>
              <li><span>+91 98765 43210</span></li>
              <li><span>Mon-Sun, 6AM - 10PM</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-salt-white/10 mt-8 pt-6 text-center text-xs text-salt-white/40">
          © 2026 UrbanFish. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
