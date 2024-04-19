export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export enum PaymentMethods {
  Online = 'card',
  Offline = 'cash'
}

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethods;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
}
