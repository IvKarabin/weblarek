import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IFormStandart {
  err: string;
  buttonState: boolean;
}

export class FormStandart<T> extends Component<T & IFormStandart> {
  protected button: HTMLButtonElement;
  protected errorElement: HTMLElement;
  protected form: HTMLFormElement;

  constructor(container: HTMLElement) {
    super(container);

    this.form = container as HTMLFormElement;
    this.button = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.onSubmit();
    });
  }

  set buttonState(isValid: boolean) {
    this.button.disabled = !isValid;
  }

  set error(err: string) {
    this.errorElement.textContent = err;
  }

  protected onSubmit(){};
}