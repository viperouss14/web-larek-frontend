export interface IProduct {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export enum PaymentMethod {
  Online = 'online',
  Offline = 'offline'
}

export interface IOrderForm {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IAppState {
  catalog: IProduct[];
  basket: string;
  order: IOrder | null;
  loading: boolean;
  total: number | null;
}

// ??нужен
export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
