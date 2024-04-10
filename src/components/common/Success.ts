import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: number;

	constructor(container: HTMLElement, actions: ISuccessActions, total: number) {
		super(container);
		this._close = ensureElement<HTMLElement>('.order-success__close',	this.container);
		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
	setTotal(total: number) {
		this._total = total;
		const orderTotal = ensureElement<HTMLElement>('.order-success__description', this.container);
		orderTotal.textContent = `Списано ${this._total} синапсов`;
	}
}
