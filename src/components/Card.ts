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

