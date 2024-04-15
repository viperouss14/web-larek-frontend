import { Component } from '../base/Component';
import { cloneTemplate, createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IProduct } from '../../types';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
	itemsInBasket: IProduct[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected _orderButton: HTMLButtonElement;
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this._list = container.querySelector('.basket__list') as HTMLElement;
		this._total = container.querySelector('.basket__price') as HTMLElement;
		this._orderButton = container.querySelector('.basket__button') as HTMLButtonElement;
		this._button = document.querySelector('.header__basket') as HTMLElement;
		this._counter = this._button.querySelector('.header__basket-counter') as HTMLElement;

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('basket:open');
			});
		}

		if (this._orderButton) {
			this._orderButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
	}

	renderBasketItems(itemsInBasket: IProduct[]) {
		let counter = 1;
		this._list.innerHTML = '';
		itemsInBasket.forEach((item) => {
			const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
			const newItemInBasket = cloneTemplate(cardBasketTemplate);
			newItemInBasket.querySelector('.basket__item-index').textContent = `${counter}`;
			newItemInBasket.querySelector('.card__title').textContent = item.title;
			newItemInBasket.querySelector('.card__price').textContent = `${item.price} синапсов`;
			newItemInBasket.querySelector('.basket__item-delete').addEventListener('click', () => {
				this.events.emit('basket:itemRemoved', item);
			});
			this._list.appendChild(newItemInBasket);
			counter += 1;
		});
	}

	updateCounter(itemsInBasket: IProduct[]) {
		this._counter.textContent = itemsInBasket.length.toString();
	}

  setBasketMessage(message: string) {
		this._list.innerHTML = message;
	}

	setOrderButtonDisabled(disabled: boolean) {
		this.setDisabled(this._orderButton, disabled);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}
}
