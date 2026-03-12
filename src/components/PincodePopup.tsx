import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

export default function PincodePopup() {
  const [open, setOpen] = useState(true);
  const [pincode, setPincode] = useState('');
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  const handleCheck = () => {
    if (pincode.length >= 5) {
      setChecked(true);
      setTimeout(() => setOpen(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
          >
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold">Check Delivery Availability</h2>
              <p className="text-sm text-muted-foreground font-body mt-1">Enter your pincode to check if we deliver to your area</p>
            </div>

            {!checked ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter Pincode"
                  className="input-field rounded-lg text-center text-lg font-display tracking-widest"
                  maxLength={6}
                  autoFocus
                />
                <button
                  onClick={handleCheck}
                  disabled={pincode.length < 5}
                  className="btn-cart w-full rounded-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Availability
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎉</span>
                </div>
                <p className="font-display text-sm font-semibold text-accent">Great news! We are available at your location.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
