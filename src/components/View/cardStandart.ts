import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export class StandartCard<T> extends Component<T & Pick<IProduct, 'title' | 'price'>> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = String(value);
  }

  set price(value: number | null) {
    if (value != null) {
      this.priceElement.textContent = `${String(value)} синапсов`;
    } else {
      this.priceElement.textContent = `Бесценно`;
    }
  }

  set cardImage(data: { url: string; title: string}) {
    this.setImage(this.imageElement, data.url, `Изображение ${data.title}`);
  }
}