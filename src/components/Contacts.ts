import { Form } from "./common/Form";
import { IOrderForm } from "../types/index";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Contacts extends Form<IOrderForm> {
    protected _phoneInput: HTMLInputElement;
    protected _emailInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);

        this._phoneInput.addEventListener('input', () => {
            this.checkSubmitButtonState();
        });

        this._emailInput.addEventListener('input', () => {
            this.checkSubmitButtonState();
        });

        this._submitButton.addEventListener('click', () => {
            events.emit('payment:submit');
        });

        events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
          this.updateFormErrors(errors);
        });
    }

    updateFormErrors(errors: Partial<IOrderForm>) {
      const formErrors = this.container.querySelector('.form__errors')
      formErrors.textContent = Object.values(errors).join('; ');
  }

    checkSubmitButtonState() {
      const isPhoneValid = !!this._phoneInput.value.trim();
      const isEmailValid = !!this._emailInput.value.trim();

      if (isPhoneValid && isEmailValid) {
          this._submitButton.disabled = false;
      } else {
          this._submitButton.disabled = true;
      }
  }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    getPhone():string{
        return this._phoneInput.value;
    }

    getEmail():string{
        return this._emailInput.value;
    }
}
