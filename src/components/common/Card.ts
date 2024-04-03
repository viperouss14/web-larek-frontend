interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

interface IProductInBasket {
	index: number;
	id: string;
	title: string;
	price: number;
	deleteButton: HTMLButtonElement;
}
