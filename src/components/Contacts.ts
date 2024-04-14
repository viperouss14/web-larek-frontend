import { Form } from "./common/Form";
import { IOrderForm } from "../types/index";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Contacts extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        const phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        const emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);

        phoneInput.addEventListener('input', () => {
            this.checkSubmitButtonState();
        });

        emailInput.addEventListener('input', () => {
            this.checkSubmitButtonState();
        });

        const submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        submitButton.addEventListener('click', () => {
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
      const phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
      const emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
      const submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

      const isPhoneValid = !!phoneInput.value.trim();
      const isEmailValid = !!emailInput.value.trim();

      if (isPhoneValid && isEmailValid) {
          submitButton.disabled = false;
      } else {
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
        return (this.container.elements.namedItem('email') as HTMLInputElement).value;
    }

    getPhone():string{
        return (this.container.elements.namedItem('phone') as HTMLInputElement).value;
    }
}
