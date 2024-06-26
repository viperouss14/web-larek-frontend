import { AppState } from './components/AppData';
import { Card } from './components/Card';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { ShopAPI } from './components/ShopAPI';
import { IOrderForm, IProduct, PaymentMethods } from './types/index';
import { EventEmitter } from './components/base/events';
import { Success } from './components/common/Success';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Contacts } from './components/Contacts';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Отрисовка карточек на странице
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		});
	});
	page.counter = appData.getItemId().length;
});

// Открыть карточку в модальном окне
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
	const productId = item.id;
	const basketItems = appData.getItemId();
	const isItemInBasket = basketItems.includes(productId);
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!isItemInBasket) {
        appData.addItemToBasket(item);
        events.emit('basket:updated');
        modal.close();
        page.counter = appData.getItemId().length;
			}
		},
	}, isItemInBasket);

  if (item.price === null) card.disableButton();

  modal.render({
		content: card.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			button: item.button,
			category: item.category,
		}),
	});
});

// Подписка на событие обновления корзины
events.on('basket:updated', () => {
	const itemsInBasket = appData.getItemsInBasket();
	basket.renderBasketItems(itemsInBasket);
	if (itemsInBasket.length === 0) {
		basket.setBasketMessage('<p>Корзина пуста</p>');
		basket.setOrderButtonDisabled(true);
	} else {
		basket.setOrderButtonDisabled(false);
	}
  const total = appData.getTotal();
	basket.total = total;
});

// Удаление элемента из корзины
events.on('basket:itemRemoved', (item: IProduct) => {
	appData.removeItemFromBasket(item.id);
	events.emit('basket:updated');
	page.counter = appData.getItemId().length;
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (orderErrors: Partial<IOrderForm>) => {
	const { payment, address, email, phone } = orderErrors;
	order.valid = !address && !payment;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,	(data: { field: keyof IOrderForm; value: PaymentMethods }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: PaymentMethods }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Проверка способа оплаты
events.on('payment:changed', (data: { field: 'payment'; value: PaymentMethods | null }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
  events.emit('basket:updated');
});

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Подписываемся на событие открытия формы для ввода контактной информации
events.on('contacts:open', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправка заказа
events.on('payment:submit', () => {
	const productsId = appData.getItemId();

	appData.setOrderItems(productsId);
	const total = appData.getTotal();

	api
		.orderProduct(appData.order)
		.then(() => {
			const success = new Success(
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
					},
				}
			);
			success.setTotal(total.toString());

			modal.render({
				content: success.render({}),
			});
			appData.clearBasket();
      appData.clearOrder();
			events.emit('basket:updated');
      page.counter = appData.getItemId().length;
      order.resetPaymentMethod();
		})
		.catch((err) => {
			console.log(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
