import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import CatchOfTheDay from '@/components/CatchOfTheDay';
import UrbanFishGrid from '@/components/UrbanFishGrid';
import CloudKitchenGrid from '@/components/CloudKitchenGrid';
import StoreList from '@/components/StoreList';
import PincodePopup from '@/components/PincodePopup';
import { useCatchOfTheDay, useFishList, useDishes, useStores } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: catchProducts, isLoading: loadingCatch } = useCatchOfTheDay();
  const { data: fishProducts, isLoading: loadingFish } = useFishList();
  const { data: kitchenMenu, isLoading: loadingKitchen } = useDishes();
  const { data: stores, isLoading: loadingStores } = useStores();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PincodePopup />
      <Header />
      <main className="flex-1">
        <HeroBanner />
        {loadingCatch ? <LoadingSkeleton /> : <CatchOfTheDay products={catchProducts ?? []} />}
        {loadingFish ? <LoadingSkeleton /> : <UrbanFishGrid products={fishProducts ?? []} />}
        {loadingKitchen ? <LoadingSkeleton /> : <CloudKitchenGrid items={kitchenMenu ?? []} />}
        {loadingStores ? <LoadingSkeleton /> : <StoreList stores={stores ?? []} />}
      </main>
      <Footer />
    </div>
  );
};

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default Index;
