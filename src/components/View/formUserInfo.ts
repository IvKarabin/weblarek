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

  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }

  protected onSubmit(): void {
    this.events.emit('order:submit');
  }

  private phoneFormat(value: string): string {
    let phNumbers = value.replace(/\D/g, '').slice(0, 11);
    if (!phNumbers) return '';
    if (phNumbers.startsWith('8')) {
      phNumbers = '7' + phNumbers.slice(1);
    };
    let formattedPhoneNumber = '+7'

    if (phNumbers.length > 1) {
      formattedPhoneNumber += ` (${phNumbers.slice(1, 4)})`
    };
    if (formattedPhoneNumber.length >= 4) {
      formattedPhoneNumber += ` ${phNumbers.slice(4,7)}`
    };
    if (formattedPhoneNumber.length >= 7) {
      formattedPhoneNumber += `-${phNumbers.slice(7,9)}`
    };
    if (formattedPhoneNumber.length >= 9) {
      formattedPhoneNumber += `-${phNumbers.slice(9,11)}`
    };
    return formattedPhoneNumber;
  }
}