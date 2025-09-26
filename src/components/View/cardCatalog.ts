import { ensureElement } from "../../utils/utils";
import { StandartCard, ICardActions } from "./cardStandart";
import { CategoryKey, categoryMap, CDN_URL } from "../../utils/constants";
import { IProduct } from "../../types";

export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;

export class CardCatalog extends StandartCard<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
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
}