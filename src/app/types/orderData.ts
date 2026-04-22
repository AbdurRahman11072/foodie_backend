interface OrderItemInput {
  restaurantId: string;
  restaurantName: string;
  mealId: string;
  mealName: string;
  mealImg: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status?: 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
}

export interface CreateOrderInput {
  userId: string;
  orderId: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  status?: 'PREPARING' | 'DELIVERING' | 'COMPLETE';
  paymentMethod: string;
  items: OrderItemInput[];
}
