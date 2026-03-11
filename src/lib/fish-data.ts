// Health benefits and dish suggestions for each fish type
export interface HealthBenefit {
  icon: string; // lucide icon name
  title: string;
  description: string;
}

export interface DishSuggestion {
  id: string;
  name: string;
  kitchenMenuId?: string; // links to cloud kitchen menu item
}

export const fishHealthBenefits: Record<string, HealthBenefit[]> = {
  'cod-1': [
    { icon: 'Heart', title: 'Heart Healthy', description: 'Low in fat and cholesterol, supports cardiovascular health.' },
    { icon: 'Dumbbell', title: 'High Protein', description: 'Excellent source of lean protein for muscle building.' },
    { icon: 'Brain', title: 'Brain Function', description: 'Contains phosphorus essential for brain development.' },
    { icon: 'Bone', title: 'Bone Strength', description: 'Rich in Vitamin D and calcium for strong bones.' },
  ],
  'prawn-1': [
    { icon: 'Heart', title: 'Low Calorie', description: 'High protein with very low calorie content.' },
    { icon: 'Shield', title: 'Immune Boost', description: 'Rich in zinc and selenium for immune support.' },
    { icon: 'Eye', title: 'Eye Health', description: 'Contains astaxanthin, a powerful antioxidant for vision.' },
    { icon: 'Dumbbell', title: 'Muscle Recovery', description: 'Complete amino acid profile aids muscle repair.' },
  ],
  'salmon-1': [
    { icon: 'Heart', title: 'Omega-3 Rich', description: 'One of the best sources of heart-healthy omega-3 fatty acids.' },
    { icon: 'Brain', title: 'Brain Health', description: 'DHA supports cognitive function and memory.' },
    { icon: 'Shield', title: 'Anti-inflammatory', description: 'Reduces inflammation throughout the body.' },
    { icon: 'Eye', title: 'Vision Support', description: 'Contains vitamin A and astaxanthin for healthy eyes.' },
  ],
  'pomfret-1': [
    { icon: 'Heart', title: 'Heart Friendly', description: 'Low fat content helps maintain healthy cholesterol levels.' },
    { icon: 'Dumbbell', title: 'Lean Protein', description: 'Excellent source of easily digestible protein.' },
    { icon: 'Bone', title: 'Mineral Rich', description: 'Good source of calcium, iron and phosphorus.' },
    { icon: 'Shield', title: 'Immunity', description: 'Rich in vitamins A and D for immune support.' },
  ],
  'seer-1': [
    { icon: 'Heart', title: 'Omega-3', description: 'High omega-3 content supports heart and brain health.' },
    { icon: 'Dumbbell', title: 'High Protein', description: 'Dense protein content for sustained energy.' },
    { icon: 'Brain', title: 'Cognitive Health', description: 'DHA and EPA support brain function.' },
    { icon: 'Bone', title: 'Vitamin D', description: 'Natural source of vitamin D for bone health.' },
  ],
  'squid-1': [
    { icon: 'Dumbbell', title: 'Protein Packed', description: 'High in protein with minimal fat content.' },
    { icon: 'Heart', title: 'Heart Health', description: 'Contains taurine which supports cardiovascular health.' },
    { icon: 'Shield', title: 'Zinc Rich', description: 'Excellent source of zinc for immune function.' },
    { icon: 'Brain', title: 'B12 Vitamins', description: 'Rich in vitamin B12 for nervous system health.' },
  ],
};

export const fishDishSuggestions: Record<string, DishSuggestion[]> = {
  'cod-1': [
    { id: 'd1', name: 'Fish Tacos', kitchenMenuId: 'km-3' },
    { id: 'd2', name: 'Seafood Chowder', kitchenMenuId: 'km-4' },
    { id: 'd3', name: 'Grilled Cod with Herbs' },
    { id: 'd4', name: 'Fish & Chips' },
  ],
  'prawn-1': [
    { id: 'd5', name: 'Prawn Stir-Fry', kitchenMenuId: 'km-2' },
    { id: 'd6', name: 'Seafood Chowder', kitchenMenuId: 'km-4' },
    { id: 'd7', name: 'Garlic Butter Prawns' },
    { id: 'd8', name: 'Prawn Biryani' },
  ],
  'salmon-1': [
    { id: 'd9', name: 'Grilled Salmon Bowl', kitchenMenuId: 'km-1' },
    { id: 'd10', name: 'Salmon Sashimi' },
    { id: 'd11', name: 'Baked Salmon with Lemon' },
    { id: 'd12', name: 'Salmon Teriyaki' },
  ],
  'pomfret-1': [
    { id: 'd13', name: 'Fried Pomfret' },
    { id: 'd14', name: 'Steamed Pomfret with Ginger' },
    { id: 'd15', name: 'Pomfret Curry' },
  ],
  'seer-1': [
    { id: 'd16', name: 'Seer Fish Fry' },
    { id: 'd17', name: 'King Fish Curry' },
    { id: 'd18', name: 'Tandoori King Fish' },
  ],
  'squid-1': [
    { id: 'd19', name: 'Calamari Rings' },
    { id: 'd20', name: 'Squid Masala' },
    { id: 'd21', name: 'Grilled Squid Salad' },
  ],
};

// Default benefits for fish not in the map
export const defaultHealthBenefits: HealthBenefit[] = [
  { icon: 'Heart', title: 'Heart Healthy', description: 'Seafood is naturally low in saturated fat.' },
  { icon: 'Dumbbell', title: 'High Protein', description: 'Excellent source of lean, quality protein.' },
  { icon: 'Brain', title: 'Brain Function', description: 'Rich in omega-3 fatty acids for cognitive health.' },
];

export const defaultDishSuggestions: DishSuggestion[] = [
  { id: 'dd1', name: 'Grilled with Herbs' },
  { id: 'dd2', name: 'Fish Curry' },
  { id: 'dd3', name: 'Pan-Seared Fillet' },
];
