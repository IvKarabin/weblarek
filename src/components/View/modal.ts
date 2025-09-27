
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
      this.button = ensureElement<HTMLButtonElement>('.modal__close', this.container);

      this.button.addEventListener('click', () => {
        this.events.emit('modal:close');
      });

      this.container.addEventListener('click', (event: MouseEvent) => {
        if (event.target === this.container) {
          this.events.emit('modal:close');
        }
      });
  }

  set content(template: HTMLElement) {
    this.contentElement.replaceChildren(template);
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = '';
  }

  isOpen(): boolean {
    return this.container.classList.contains('modal_active');
  }
}
