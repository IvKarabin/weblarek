
import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment | null;
  protected email: string;
  protected phone: string;
  protected address: string;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events = events;
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit('buyer:changed', this.getData());
  }
  setEmail(email: string): void {
    this.email = email;
    this.events.emit('buyer:changed', this.getData());
  }
  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('buyer:changed', this.getData());
  }
  setAddress(address: string): void {
    this.address = address;
    this.events.emit('buyer:changed', this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clearData(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  /**
   * Валидация
   */
  validatePayment(): { isValid: boolean, error?: string } {
    if (!this.payment) {
      return { isValid: false, error: "Выберите способ оплаты" };
    }
    return { isValid: true };
  }
  validateAddress(): { isValid: boolean, error?: string } {
    if (!this.address && this.address.trim() === "") {
      return { isValid: false, error: "Введите адрес доставки" };
    }
    return { isValid: true };
  }
  validateEmail(): { isValid: boolean, error?: string } {
    if (!this.email && this.email.trim() === "") {
      return { isValid: false, error: "Введите электронную почту" };
    }
    return { isValid: true };
  }
  validatePhone(): { isValid: boolean, error?: string } {
    if (!this.phone && this.phone.trim() === "") {
      return { isValid: false, error: "Введите номер телефона" };
    }
    return { isValid: true };
  }
}
