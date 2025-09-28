import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { StandartCard } from "./cardStandart";
import { CDN_URL } from "../../utils/constants";

export interface ICardBasket {
  index: number;
}

export interface IBasketCardActions {
  onRemove?: () => void;
}

export class CardBasket extends StandartCard<ICardBasket> {
  protected indexElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents, protected actions?: IBasketCardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.button = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.button.addEventListener('click', () => {
      if (this.actions?.onRemove) {
        this.actions.onRemove();
      } 
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set image(data: {url: string; title: string}) {
  this.cardImage = { 
    url: `${CDN_URL}/${data.url}`, 
    title: data.title 
  };
}
}