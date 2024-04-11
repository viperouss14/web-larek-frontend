import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { ProductItem } from '../AppData';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
	itemsInBasket: ProductItem[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected _orderButton: HTMLButtonElement;
	protected itemsInBasket: ProductItem[];
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.itemsInBasket = [];
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

	addItemToBasket(item: ProductItem) {
		this.itemsInBasket.push(item);
		this.renderBasketItems();
		this.updateTotal();
		this.updateCounter();
	}

	removeItemFromBasket(item: ProductItem) {
		this.itemsInBasket = this.itemsInBasket.filter((i) => i !== item);
		this.renderBasketItems();
		this.updateTotal();
		this.updateCounter();
	}
  
	updateTotal() {
		let total = 0;
		this.itemsInBasket.forEach((item) => total += item.price);
		this.getItemsInBasket();
		return (this.total = total);
	}

	renderBasketItems() {
		let counter = 1;
		this._list.innerHTML = '';
		this.itemsInBasket.forEach((item) => {
      const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
			const newItemInBasket = cloneTemplate(cardBasketTemplate);
      newItemInBasket.querySelector('.basket__item-index').textContent = `${counter}`;
      newItemInBasket.querySelector('.card__title').textContent = item.title;
      newItemInBasket.querySelector('.card__price').textContent = `${item.price} синапсов`;
      newItemInBasket.querySelector('.basket__item-delete').addEventListener('click', () => {
        this.removeItemFromBasket(item);
      });
      this._list.appendChild(newItemInBasket);
      counter += 1;
		});
	}

	getItemsInBasket(): ProductItem[] {
		if (this.itemsInBasket.length === 0) {
			this._list.innerHTML = '<p>Корзина пуста</p>';
			this.setDisabled(this._orderButton, true);
		} else {
			this.setDisabled(this._orderButton, false);
		}

		return this.itemsInBasket;
	}

	getItemId() {
		return this.itemsInBasket.map((item) => item.id);
	}

	clearBasket() {
		this.itemsInBasket = [];
		this.renderBasketItems();
		this.updateTotal();
		this.updateCounter();
	}

	private updateCounter() {
		this._counter.textContent = this.itemsInBasket.length.toString();
	}
}
