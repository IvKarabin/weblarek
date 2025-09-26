import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IFormStandart {
  err: string;
  buttonState: boolean;
}

export class FormStandart<T> extends Component<T & IFormStandart> {
  protected button: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
  }

  set buttonState(isValid: boolean) {
    this.button.disabled = !isValid;
  }

  set error(err: string) {
    this.errorElement.textContent = err;
  }
}