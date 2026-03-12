import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import CatchOfTheDay from '@/components/CatchOfTheDay';
import UrbanFishGrid from '@/components/UrbanFishGrid';
import CloudKitchenGrid from '@/components/CloudKitchenGrid';
import StoreList from '@/components/StoreList';
import PincodePopup from '@/components/PincodePopup';
import { mockCatchOfTheDay, mockUrbanFishProducts, mockKitchenMenu, mockStores } from '@/lib/mock-data';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PincodePopup />
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <CatchOfTheDay products={mockCatchOfTheDay} />
        <UrbanFishGrid products={mockUrbanFishProducts} />
        <CloudKitchenGrid items={mockKitchenMenu} />
        <StoreList stores={mockStores} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
