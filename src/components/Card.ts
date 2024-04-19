import { categoryClassVariables } from "../utils/constants";
import { formatNumber } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	title: string;
	description?: string | string[];
	image: string;
	category: string;
	price: number;
	button: string;
  basketCounter?: string;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
  protected _basketId: HTMLElement;
  protected _basketCounter: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');
    this._basketCounter = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
  }

  // номер карточки в корзине
	set basketCounter(value: string) {
		this._basketCounter.textContent = value;
	}

	get basketCounter() {
		return this._basketCounter.textContent;
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

  set button(value: string) {
    if(this._button) this._button.textContent = value;
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `card__category ${categoryClassVariables[value]}`;
  }

  set price(value: number | null) {
    !value
      ? this.setText(this._price, 'Бесценно')
      : this.setText(this._price, `${formatNumber(value)} синапсов`)
  }

  get price(): number {
    return Number(this._price.textContent || '');
  }

  disableButton() {
		this.setDisabled(this._button, true);
	}
}
