import { AppState, CatalogChangeEvent,	ProductItem } from './components/AppData';
import { CatalogItem } from './components/Card';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { ShopAPI } from './components/ShopAPI';
import { IOrderForm, PaymentMethods } from './types/index';
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
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardBasketModal = ensureElement<HTMLTemplateElement>('#card-basket');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactTemplate), events);

// Отрисовка карточек на странице
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
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
	page.counter = basket.getItemsInBasket().length;
});

// Открыть карточку в модальном окне
events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate));
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

	const modalContainer = document.querySelector('#modal-container');
	const addToBasketButton = modalContainer.querySelector('.card .card__button') as HTMLButtonElement;

  const productId = item.id;
	const basketItems = basket.getItemsInBasket();
	const isItemInBasket = basketItems.some((item) => item.id === productId);
	if (isItemInBasket) {
		addToBasketButton.disabled = true;
		addToBasketButton.classList.add('disabled');
		addToBasketButton.textContent = 'Товар уже в корзине';
	} else if (item.price === null) {
		addToBasketButton.disabled = true;
		addToBasketButton.classList.add('disabled');
	}

	addToBasketButton.addEventListener('click', () => {
		if (!isItemInBasket) {
			basket.addItemToBasket(item);
			localStorage.setItem('basketItems',	JSON.stringify(basket.getItemsInBasket()));
			modal.close();
			page.counter = basket.getItemsInBasket().length;
		}
	});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address } = errors;
	order.valid = !email && !phone && !address;
	order.errors = Object.values({ phone, email, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\.(payment|address):change/,
	(data: { field: keyof IOrderForm; value: PaymentMethods }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Проверка способа оплаты
events.on(
	'payment:changed',
	(data: { field: 'payment'; value: PaymentMethods | null }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
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
events.on('contact:open', () => {
	modal.render({
		content: contact.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправка заказа
events.on('payment:submit', () => {
	const email = contact.getEmail();
	const phone = contact.getPhone();
	const total = basket.updateTotal();
	const productsId = basket.getItemId();

	appData.order.email = email;
	appData.order.phone = phone;
	appData.order.total = total;
	appData.order.items = productsId;

	api
		.orderProduct(appData.order)
		.then(() => {
			const success = new Success(
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
					},
				},
				total
			);
			success.setTotal(total);

			modal.render({
				content: success.render({}),
			});
			basket.clearBasket();
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
