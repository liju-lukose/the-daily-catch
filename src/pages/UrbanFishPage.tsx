import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UrbanFishGrid from '@/components/UrbanFishGrid';
import { mockUrbanFishProducts } from '@/lib/mock-data';

export default function UrbanFishPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <UrbanFishGrid products={mockUrbanFishProducts} showAll />
      </main>
      <Footer />
    </div>
  );
}
