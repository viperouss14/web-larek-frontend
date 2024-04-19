import { AppState } from './components/AppData';

import { Page } from './components/Page';
import { ShopAPI } from './components/ShopAPI';
import { IOrderForm, IProduct, PaymentMethods } from './types/index';
import { EventEmitter } from './components/base/events';

import { Modal } from './components/common/Modal';

import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement, isEmpty } from './utils/utils';
import { Card } from './components/Card';
import { Basket } from './components/common/Basket';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
// const order = new Order(cloneTemplate(orderTemplate), events);
// const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
// const success = new Success(cloneTemplate(successTemplate), {
// 	onClick: () => {
// 		modal.close();
// 	},
// });

events.on('items:changed', () => {
  page.catalog = appData.catalog.map((item: IProduct) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });

    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price,
    })
  });
});

//добавялем тригер открытия модального окна
events.on('card:select', (item: IProduct) => appData.setPreview(item));

//создаем и отрисовываем модальное окно
events.on('preview:changed', (item: IProduct) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('basket:check', item);
      card.button = appData.basket.indexOf(item) === -1
        ? 'Добавить в корзину'
        : 'Удалить из корзины';
    },
  });

  if(isEmpty(item.price)) card.disableButton();

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      description: item.description,
      category: item.category,
      price: item.price,
      button: appData.basket.indexOf(item)
        ? 'Добавить в корзину'
        : 'Удалить из корзины',
    }),
  });
});


// Получаем товары с сервера
api
.getProductList()
.then(appData.setCatalog.bind(appData))
.catch((err) => {
		console.error(err);
	});

//работа с корзиной
events.on('basket:check', (item: IProduct) => {
  appData.basket.indexOf(item) === -1
  ? events.emit('basket:item-add', item)
  : events.emit('basket:item-remove', item);
});

events.on('basket:item-add', (item: IProduct) => {
  appData.addToBasket(item);
  appData.setItem(item);
});

events.on('basket:item-remove', (item: IProduct) => {
  appData.deleteFromBasket(item);
  appData.removeItem(item.id);
});

events.on('basket-count:change', () => {
  page.counter = appData.basket.length;
});

events.on('basket:open', () => {
	basket.selected = appData.basket;
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:change', (items: IProduct[]) => {
  basket.items = items.map((product, basketCounter) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('basket:item-remove', product);
      },
    });

    return card.render({
      basketCounter: (basketCounter + 1).toString(),
      title: product.title,
      price: product.price,
    });
  });
  
  basket.selected = appData.basket;
  basket.total = items.reduce((total, item) => total + item.price, 0);
  appData.order.total = items.reduce((total, item) => total + item.price, 0);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});
