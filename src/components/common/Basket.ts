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

