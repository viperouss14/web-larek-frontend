import { Model } from './base/Model';
import { FormErrors, IAppState,	IProduct,	IOrder,	IOrderForm, PaymentMethods } from '../types/index';

export class AppState extends Model<IAppState> {
	basket: string[] = [];
	catalog: IProduct[];
	loading: boolean;
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		items: [],
		total: null,
		payment: null,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	getTotal() {
		return this.order.items.reduce(
			(a, b) => a + this.catalog.find((item) => item.id === b).price,	0);
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(payment: keyof IOrderForm, value: PaymentMethods | null) {
		this.order[payment] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

  setOrderItems(items: string[]) {
		this.order.items = items;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

  clearOrder() {
		this.order = {
			email: '',
			phone: '',
			address: '',
			items: [],
			total: null,
			payment: null,
		};
	}

	getProducts(): IProduct[] {
		return this.catalog;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.phone) {
      errors.phone = 'Введите номер телефона';
    }
     if (!this.order.email) {
      errors.email = 'Введите адрес электронной почты';
    }
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}


}
