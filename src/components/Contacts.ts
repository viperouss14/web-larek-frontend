import { Form } from "./common/Form";
import { IOrderForm } from "../types/index";
import { IEvents } from "./base/events";

export class Contacts extends Form<IOrderForm> {
    protected _email: string = '';
    protected _phone: string = '';
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        const phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        const emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;

        phoneInput.addEventListener('input', () => {
            this._phone = phoneInput.value.trim();
            this.checkSubmitButtonState();
        });

        emailInput.addEventListener('input', () => {
            this._email = emailInput.value.trim();
            this.checkSubmitButtonState();
        });

        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitButton.addEventListener('click', () => {
            events.emit('payment:submit');
        });
    }

    checkSubmitButtonState() {
        const phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        const emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;

        const phonePattern = /^\+?\d{1,3}?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/;
        const isPhoneValid = phonePattern.test(phoneInput.value.trim());

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailPattern.test(emailInput.value.trim());
        const formErrors = this.container.querySelector('.form__errors')

        if (isPhoneValid && isEmailValid) {
            formErrors.textContent = ''
            submitButton.disabled = false;
        } else {
            formErrors.textContent = 'Введите почту и номер телефона в заданном формате'
            submitButton.disabled = true;
        }
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    getEmail():string{
        return this._email

    }
    getPhone():string{
        return this._phone

    }
}
