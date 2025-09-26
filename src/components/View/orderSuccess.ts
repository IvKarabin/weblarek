import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
  content: HTMLElement;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected totalElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.button.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${String(value)} синапсов`;
  }
}