import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CloudKitchenGrid from '@/components/CloudKitchenGrid';
import { mockKitchenMenu } from '@/lib/mock-data';

export default function CloudKitchenPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <CloudKitchenGrid items={mockKitchenMenu} showAll />
      </main>
      <Footer />
    </div>
  );
}
