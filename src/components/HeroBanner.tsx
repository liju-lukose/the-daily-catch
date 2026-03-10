import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImg from '@/assets/hero-market.jpg';

export default function HeroBanner() {
  return (
    <section className="relative h-[60vh] md:h-[50vh] overflow-hidden bg-deep-water">
      <img
        src={heroImg}
        alt="Fresh seafood market display"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-water/90 via-deep-water/40 to-transparent" />
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-10 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl md:text-5xl font-bold text-salt-white leading-tight max-w-xl">
            From the Ocean
            <br />
            <span className="text-buoy-orange">to Your Table</span>
          </h1>
          <p className="font-body text-salt-white/70 mt-3 max-w-md text-sm md:text-base">
            Fresh seafood, healthy dishes, and trusted local fish stores — all on one platform.
          </p>
          <div className="flex gap-3 mt-6">
            <Link to="/urban-fish" className="btn-cart">
              Shop Now
            </Link>
            <Link to="/cloud-kitchen" className="btn-secondary bg-salt-white/10 text-salt-white border-salt-white/20 hover:bg-salt-white/20">
              Order Food
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
