import { ensureElement } from "../../utils/utils";
import { FormStandart } from "./formStandart";
import { IEvents } from "../base/Events";

interface IFormUserInfo {
  email: string;
  phone: string;
}

export class FormUserInfo extends FormStandart<IFormUserInfo> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailElement.addEventListener('input', () => {
      this.events.emit('contacts:email', { email: this.emailElement.value });
    });

    this.phoneElement.addEventListener('input', () => {
      const formattedPhone = this.phoneFormat(this.phoneElement.value);
      this.phoneElement.value = formattedPhone;
      this.events.emit('contacts:phone', { phone: formattedPhone });
    });

    this.button.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }

  private phoneFormat(value: string): string {
    let phNumbers = value.replace(/\D/g, '');
    let formattedPhoneNumber = '';
    if (phNumbers.startsWith('8')) {
        formattedPhoneNumber = '+7 (' + phNumbers.substring(1, 4) + ') ' + phNumbers.substring(4, 7) + '-' + phNumbers.substring(7, 9) + '-' + phNumbers.substring(9, 11);
    } else {
        formattedPhoneNumber = '+7 (' + phNumbers.substring(0, 3) + ') ' + phNumbers.substring(3, 6) + '-' + phNumbers.substring(6, 8) + '-' + phNumbers.substring(8, 10);
    }
    return formattedPhoneNumber;
  }
}