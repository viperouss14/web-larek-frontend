import { Form } from './common/Form';
import { IOrderForm, PaymentMethods } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _payment: PaymentMethods | null;
  protected _onlinePayButton: HTMLButtonElement;
  protected _offlinePayButton: HTMLButtonElement;
  protected _orderButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._onlinePayButton = ensureElement<HTMLButtonElement>('button[name="card"]',	this.container);
    this._offlinePayButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this._orderButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]',	this.container);

		if (this._onlinePayButton) {
			this._onlinePayButton.addEventListener('click', () => {
				this.payment = PaymentMethods.Online;
				this.updatePaymentButtons();
			});
		}

		if (this._offlinePayButton) {
			this._offlinePayButton.addEventListener('click', () => {
				this.payment = PaymentMethods.Offline;
				this.updatePaymentButtons();
			});
		}

		if (this._orderButton) {
			this._orderButton.addEventListener('click', () => {
				this.handleOrderButtonClick();
			});
		}
	}

	updatePaymentButtons() {
		this._onlinePayButton?.classList.remove('button_alt-active');
		this._offlinePayButton?.classList.remove('button_alt-active');

		if (this._payment === 'card') {
			this._onlinePayButton?.classList.add('button_alt-active');
		} else if (this._payment === 'cash') {
			this._offlinePayButton?.classList.add('button_alt-active');
		}
	}

	handleOrderButtonClick() {
		if (this._addressInput && this._payment) {
			this.events.emit('contacts:open');
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
		return this._addressInput.value;
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

  resetPaymentMethod() {
    this._payment = null;
    this.updatePaymentButtons();
  }
}
