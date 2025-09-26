import { ensureElement } from "../../utils/utils";
import { StandartCard } from "./cardStandart";
import { CategoryKey, categoryMap, CDN_URL } from "../../utils/constants";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'>;

export class CardPreview extends StandartCard<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected button: HTMLButtonElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.button.addEventListener('click', () => {
      const currentState = this.button.textContent;
      if (currentState === 'Добавить в корзину') {
        this.events.emit('card:add');
        this.buttonState = 'remove';
      } else if (currentState === 'Удалить из корзины') {
        this.events.emit('card:remove');
        this.buttonState = 'add';
      }
    });
  }

  set image(url: string) {
    this.setImage(this.imageElement, `${CDN_URL}/${url}`, this.titleElement.textContent ?? '');
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonState(state: 'add' | 'remove' | 'disabled') {
    this.button.textContent = state === 'add' ? 
      'Добавить в корзину' 
      : state === 'remove' 
      ? 'Удалить из корзины' 
      : 'Недоступно';
    this.button.disabled = state === 'disabled';
  }
}