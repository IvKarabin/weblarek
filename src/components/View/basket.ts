
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  products: HTMLElement[];
  total: number;
  message: string;
  buttonState: boolean;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.button.addEventListener('click', () => {
      this.events.emit('order');
    });
  }

  set products(products: HTMLElement[]) {
    this.listElement.innerHTML = '';
    if (products.length === 0) {
      this.listElement.textContent = 'Корзина пуста';
      this.total = 0;
      this.buttonState = false;
    } else {
      products.forEach(product => this.listElement.append(product));
      this.buttonState = true;
    }  
  }

  set total(value: number) {
    this.totalElement.textContent = `${String(value)} синапсов`;
  }

  set buttonState(state: boolean) {
    if (state === false) {
      this.button.disabled = true;
    } else {
      this.button.disabled = false;
    }
  }

  set message(value: string) {
    this.listElement.textContent = value;
  }
}
