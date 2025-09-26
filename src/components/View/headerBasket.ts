
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeaderBasket {
  counter: number;
}

export class HeaderBasket extends Component<IHeaderBasket> {
  protected counterElement: HTMLElement;
  protected button: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.button = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.button.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
 }
}
