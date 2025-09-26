
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { FormStandart } from "./formStandart";
import { IEvents } from "../base/Events";

interface IFormOrder {
  payment: 'card' | 'cash';
  address: string;
}

export class FormOrder extends FormStandart<IFormOrder> {
  protected paymentElement: 'card' | 'cash' | null;
  protected paymentButtons: HTMLElement[];
  protected addressElement: HTMLInputElement;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.paymentButtons = Array.from(ensureAllElements('.order__buttons .button_alt', this.container));
    this.addressElement = ensureElement<HTMLInputElement>('.form__input', this.container);
    this.paymentElement = null;

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', (event: MouseEvent) => {
        const target = event.currentTarget as HTMLButtonElement;
        const value = target.name as 'card' | 'cash';
        this.payment = value;
        this.events.emit('order:payment', { payment: value });
      });
    });

    this.addressElement.addEventListener('input', () => {
      this.events.emit('order:address', { address: this.addressElement.value });
    });

    this.button.addEventListener('click', () => {
      this.events.emit('order:next');
    });
  }

  set payment(value: 'card' | 'cash') {
    this.paymentElement = value;
    this.paymentButtons.forEach((button) => {
      const buttonElement = button as HTMLButtonElement;
      if (buttonElement.name === value) {
        buttonElement.classList.add('button_alt-active');
      } else {
        buttonElement.classList.remove('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this.addressElement.value = value;
  }
}
