import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export class StandartCard<T> extends Component<T & Pick<IProduct, 'title' | 'price'>> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
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

  setImage(element: HTMLImageElement, url: string, title: string): void {
    element.src = url;
    element.alt = `Изображение ${title}`;
  }
}