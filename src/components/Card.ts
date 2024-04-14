import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { categoryClassVariables } from '../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	title: string;
	description?: string | string[];
	image: string;
	category: string;
	price: number;
	button?: HTMLButtonElement;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image',	container);
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__description');
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
    this._category.className = `card__category ${categoryClassVariables[value]}`;
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set price(value: string) {
		if (value === null){
			this.setText(this._price,'Бесценно')
		}
		else{
		this.setText(this._price, `${value} синапсов`,)
		};
	}

	get price(): string {
		return this._price.textContent;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

  disableButton() {
		this._button.setAttribute('disabled', 'disabled');
	}
}
