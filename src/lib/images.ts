import codImg from '@/assets/cod.jpg';
import prawnsImg from '@/assets/prawns.jpg';
import salmonImg from '@/assets/salmon.jpg';
import salmonBowlImg from '@/assets/salmon-bowl.jpg';
import pomfretImg from '@/assets/pomfret.jpg';
import squidImg from '@/assets/squid.jpg';
import kingfishImg from '@/assets/kingfish.jpg';

export const productImages: Record<string, string> = {
  'cod-1': codImg,
  'prawn-1': prawnsImg,
  'salmon-1': salmonImg,
  'pomfret-1': pomfretImg,
  'seer-1': kingfishImg,
  'squid-1': squidImg,
  'km-1': salmonBowlImg,
  'km-2': prawnsImg,
  'km-3': codImg,
  'km-4': salmonImg,
  'sp-1': codImg,
  'sp-2': prawnsImg,
  'sp-3': salmonImg,
  'sp-4': kingfishImg,
};

export function getProductImage(id: string): string {
  return productImages[id] || codImg;
}
