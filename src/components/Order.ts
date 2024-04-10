import { Form } from './common/Form';
import { IOrderForm, PaymentMethods } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _payment: PaymentMethods | null = PaymentMethods.Online;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Обработчик для кнопки "Онлайн"
		const onlineBuyButton = ensureElement<HTMLButtonElement>('button[name="card"]',	this.container);
		if (onlineBuyButton) {
			onlineBuyButton.addEventListener('click', () => {
				this.payment = PaymentMethods.Online; // Устанавливаем метод оплаты "Онлайн"
				this.updatePaymentButtons(); // Обновляем стили кнопок оплаты
			});
		}

		// Обработчик для кнопки "При получении"
		const offlineBuyButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
		if (offlineBuyButton) {
			offlineBuyButton.addEventListener('click', () => {
				this.payment = PaymentMethods.Offline; // Устанавливаем метод оплаты "При получении"
				this.updatePaymentButtons(); // Обновляем стили кнопок оплаты
			});
		}

		// Обработчик для кнопки "Далее"
		const orderButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
		if (orderButton) {
			orderButton.addEventListener('click', () => {
				this.handleOrderButtonClick(); // Вызываем метод при нажатии кнопки "Далее"
			});
		}
	}

	// Метод для обновления стилей кнопок оплаты
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

	// Метод для обработки нажатия кнопки "Далее"
	handleOrderButtonClick() {
		const addressInput = ensureElement<HTMLInputElement>('input[name="address"]',	this.container);
		if (addressInput && this._payment) {
			this.events.emit('contact:open');
		}
	}

	// Геттер для получения метода оплаты
	get payment(): PaymentMethods | null {
		return this._payment;
	}

	// Сеттер для установки метода оплаты
	set payment(value: PaymentMethods | null) {
		this._payment = value;
		// Генерируем событие об изменении метода оплаты
		this.events.emit('payment:changed', { field: 'payment', value });
	}

	// Геттер для получения значения адреса
	get address(): string {
		return (this.container.elements.namedItem('address') as HTMLInputElement)
			.value;
	}

	// Сеттер для установки значения адреса
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}
