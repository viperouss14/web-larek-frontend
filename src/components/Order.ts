import { Form } from './common/Form';
import { IOrderForm, PaymentMethods } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _payment: PaymentMethods | null;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		const onlineBuyButton = ensureElement<HTMLButtonElement>('button[name="card"]',	this.container);
		if (onlineBuyButton) {
			onlineBuyButton.addEventListener('click', () => {
				this.payment = PaymentMethods.Online;
				this.updatePaymentButtons();
			});
		}

		const offlineBuyButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
		if (offlineBuyButton) {
			offlineBuyButton.addEventListener('click', () => {
				this.payment = PaymentMethods.Offline;
				this.updatePaymentButtons();
			});
		}

		const orderButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
		if (orderButton) {
			orderButton.addEventListener('click', () => {
				this.handleOrderButtonClick();
			});
		}
	}

	updatePaymentButtons() {
		const onlineButton = ensureElement<HTMLButtonElement>('button[name="card"]',	this.container);
		const cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

		onlineButton?.classList.remove('button_alt-active');
		cashButton?.classList.remove('button_alt-active');

		if (this._payment === 'card') {
			onlineButton?.classList.add('button_alt-active');
		} else if (this._payment === 'cash') {
			cashButton?.classList.add('button_alt-active');
		}
	}

	handleOrderButtonClick() {
		const addressInput = ensureElement<HTMLInputElement>('input[name="address"]',	this.container);
		if (addressInput && this._payment) {
			this.events.emit('contact:open');
		}
	}

	get payment(): PaymentMethods | null {
		return this._payment;
	}

	set payment(value: PaymentMethods | null) {
		this._payment = value;
		this.events.emit('payment:changed', { field: 'payment', value });
	}

	get address(): string {
		return (this.container.elements.namedItem('address') as HTMLInputElement).value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

  resetPaymentMethod() {
    this._payment = null;
    this.updatePaymentButtons();
  }
}
