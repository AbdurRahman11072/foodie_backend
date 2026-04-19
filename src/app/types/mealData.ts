export interface MealData {
  name: string;
  restaurantId: string;
  coverImg: string;
  description: string;
  price: number;
  rating?: number;
  available: boolean;
  ingredients: string[];
  status: string;
  calories: number;
  servingSize: string;
  categories: string[];
}
