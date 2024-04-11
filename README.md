# Проектная работа "web-larёk"

🔗[Ссылка на репозиторий](https://github.com/viperouss14/web-larek-frontend.git)

🛠️Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

⚠️Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## 💻Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## 💾Описание данных

### Интерфейс ICard
Описывает информацию о товаре:
```
interface ICard<T> {
	title: string;
	description?: string | string[];
	image: string;
	category: string;
	price: number;
	button?: HTMLButtonElement;
}
```

### Интерфейс ICardActions
Описывает возможные действия с карточкой товара:
```
interface ICardActions {
  onClick: (event: MouseEvent) => void;
}
```

Перечисление для описания методов оплаты:
```
enum PaymentMethods {
  Online = 'card',
  Offline = 'cash'
}
```

### Интерфейс IOrderForm
Описывает все данные формы заказа:
```
interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethods;
}
```
### Интерфейс IOrder
Расширяет интерфейс IOrderForm, используется для последующей обработки ошибок в форме:
```
interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}
```

`type FormErrors = Partial<Record<keyof IOrder, string>>` - тип для описания объекта, который может содержать ошибки формы.

### Интерфейс IOrderResult
Описывает типы данных, когда заказ оформлен:
```
interface IOrderResult {
	id: string;
	total: number;
}
```

### Интерфейс IAppState
Описывает типы состояния приложения:
```
interface IAppState {
	catalog: IProduct;
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}
```

### Интерфейс IPage
Описывает типы счеткчика для корзины, каталога и блокировщика на главной странице:
```
interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}
```

### Интерфейс IModalData
Описывает тип данных модального окна:
```
interface IModalData {
  content: HTMLElement;
}
```

### Интерфейс IBasketView
Описывает типы данных содержимого корзины:
```
interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
	itemsInBasket: ProductItem[];
}
```

### Интерфейс IFormState
Описывает типы состояния полей формы:
```
interface IFormState {
  valid: boolean;
  errors: string[];
}
```

### Интерфейс ISuccess
Описывает тип итоговой суммы при успешном заказе:
```
interface ISuccess {
  total: number;
}
```

### Интерфейс ISuccessActions
Описывает возможные действия в случае удачной покупки:
```
interface ISuccessActions {
  onClick: () => void;
}
```

### Интерфейс IShopAPI
Описывает методы работы с API:
```
interface IShopAPI {
	getProductsList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}
```

### Интерфейс IEvents
Описывает методы обработки событий (from starter kit):
```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:
- слой данных отвечает за хранение и изменение данных;
- слой отображения отвечает за отображение данных на странице;
- слой представления отвечает за связь данных и отображения.

## 💾Модели данных

## 🗂️Слой представления (Presenter)

### 📗class EventEmitter
Базовый класс, брокер событий "наблюдатель", позволяет подписываться на события и реагировать на эти события.

Доступные методы:\
`on<T extends object>(eventName: EventName, callback: (event: T) => void)` - установить обработчик на событие;\
`off(eventName: EventName, callback: Subscriber)` - снять обработчик с события;\
`emit<T extends object>(eventName: string, data?: T)` - инициировать событие с данными;\
`onAll(callback: (event: EmitterEvent) => void)` - слушать все события;\
`offAll()` - сбросить все обработчики;\
`trigger<T extends object>(eventName: string, context?: Partial<T>)` - сделать коллбек триггер, генерирующий событие при вызове.

### 📗class Api
Базовый класс для работы с Api.

Доступные методы:\
`handleResponse(response: Response): Promise<object>` - обработчик ответа сервера;\
`get(uri: string)` - гет-запрос для получения данных с сервера;\
`post(uri: string, data: object, method: ApiPostMethods = 'POST')` - пост-запрос для отправки данных на сервер.

### 📗class ShopAPI
Для работы с Api магазина. Наследуется от базового класса Api.

Доступные методы:\
`getProductItem(id: string): Promise<IProduct>` - получение данных о товаре по id;\
`getProductsList(): Promise<IProduct[]>` - получение всего каталога товаров;\
`orderProducts(order: IOrder): Promise<IOrderResult>` - отправка оформленного заказа.

## 🗂️Слой данных (Model)

### 📗абстрактный class Model
Базовый класс для создания моделей.

Доступные методы:\
`emitChanges(event: string, payload?: object)` - сообщить всем, что модель поменялась.

### 📗class AppState
Класс представляет собой модель состояния приложения.

Доступные методы:\
`getTotal()` - возвращает итоговую стоимость;\
`setCatalog(items: IProduct[])` - отвечает за установку каталога продуктов;\
`setPreview(item: ProductItem)` - устанавливает товар для предпросмотра;\
`setOrderField(payment: keyof IOrderForm, value: PaymentMethods | null)` - устанавливает значения полей заказа;\
`getProducts()` - возвращает товары из каталога;\
`validateOrder()` - отвечает за проверку валидности формы заказа.

## 🗂️Слой отображения (View)

### 📗абстрактный class Component
Служит основой для всех компонентов в проекте и предоставляет основные методы для работы с DOM.

Доступные методы:\
`setText(element: HTMLElement, value: unknown)` - установить текстовое содержимое;\
`setImage(element: HTMLImageElement, src: string, alt?: string)` - изображение с алтернативным текстом;\
`setDisabled(element: HTMLElement, state: boolean)` - меняет статус блокировки;\
`render(data?: Partial<T>): HTMLElement` - вернуть корневой DOM-элемент.

### 📗class Page
Отвечает за отображение первоначальной страницы, каталога товаров и счетчика корзины.

Доступные методы:\
`set counter(value: number)` - устанавливает счетчик корзины;\
`set catalog(items: HTMLElement[])` - определяет каталог товаров;\
`set locked(value: boolean)` - блокирует страницу, если открыто модальное окно.

### 📗class Card
Отвечает за отображение карточки товара.

Доступные методы:\
`set id(value: string)` - устанавливает id товара;\
`set title(value: string)` - устанавливает название товара;\
`set image(value: string)` - устанавливает картинку товара;\
`set price(value: string | null)` - устанавливает цену товара;\
`set category(value: string)` - устанавливает категорию товара;\
`set description(value: string)` - устанавливает описание товара;\
`disableButton()` - отключает кнопку добавления товара в корзину.

### 📗class Modal
Отвечает за работу с модальными окнами.

Доступные методы:\
`set content(value: HTMLElement)` - устанавливает контент в модальное окно;\
`open()` - открытие модального окна;\
`close()` - закрытие модального окна;\
`render(data: IModalData)` - рендер модального окна.

### 📗class Basket
Отвечает за работу с корзиной.

Доступные методы:\
`set total(value: number)` - устанавливает итоговую сумму заказа;\
`addItemToBasket(item: ProductItem)` - добавляет товар в корзину;\
`removeItemFromBasket(item: ProductItem)` - удаляет товар из корзины;\
`updateTotal()` - обновляет итоговую сумму заказа;\
`renderBasketItems()` - отображает товары в козине;\
`getItemsInBasket()` - возвращает товары, находящиеся в корзине;\
`getItemId()` - возвращает id товара;\
`clearBasket()` - убирает все товары из корзины;\
`private updateCounter()` - обновляет счетчик товаров в корзине.

### 📗class Form
Для работы с формой заказа.

Доступные методы:\
`onInputChange(field: keyof T, value: string)` - обработка изменений ввода пользователем;\
`set valid(value: boolean)` - управляет доступностью кнопки в зависимости от валидности данных в форме;\
`set errors(value: string)` - устанавливает ошибки;\
`render(state: Partial<T> & IFormState)` - отрисовывает внешний вид формы в соответствии с переданным состоянием.

### 📗class Order
Для работы с формой заказа, в которой выбирается способ оплаты и указывается адрес.

Доступные методы:\
`updatePaymentButtons()` - обновляет стили кнопок выбора способа оплаты;\
`handleOrderButtonClick()` - обрабатывает нажатие кнопки "далее" и проверяет, что все поля заполнены;\
`get payment()` - возвращает значение выбранного способа оплаты;\
`set payment(value: PaymentMethods | null)` - устанавливает значение выбранного способа оплаты;\
`get address()` - возвращает значение адреса доставки;\
`set address(value: string)` - устанавливает значение адреса доставки.

### 📗class Contacts
Для работы с формой заказа, в которой указываеются эл. почта и телефон.

Доступные методы:\
`checkSubmitButtonState()` - проверяет состояние кнопки "оплатить" по состоянию полей `input`;\
`set email(value: string)` - устанавливает значение почты пользователя;\
`set phone(value: string)` - устанавливает значение номера телефона пользователя;\
`getEmail()` - возвращает введенную электронную почту;\
`getPhone()` - возвращает введенный телефон.

### 📗class Success
Для вывода сообщения об успешном оформлении заказа.

Доступные методы:\
`setTotal(total: number)` - устанавливает итоговую стоимость заказа.
