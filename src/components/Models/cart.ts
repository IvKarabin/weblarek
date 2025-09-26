import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  protected cart: IProduct[];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.cart = [];
    this.events = events;
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.cart.push(product);
      this.events.emit('cart:changed', { 
        items: this.cart, 
        total: this.getTotal(), 
        count: this.getCount() 
      });
    }
  }

  deleteItem(product: IProduct): void {
    this.cart = this.cart.filter(item => item.id !== product.id);
    this.events.emit('cart:changed', { 
      items: this.cart, 
      total: this.getTotal(), 
      count: this.getCount() 
    });
  }
  
  getItems(): IProduct[] {
    return this.cart;
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this.cart.length;
  }

  hasItem(id: string): boolean {
    return this.cart.some(item => item.id === id);
  }
  
  clear(): void {
    this.cart = [];
    this.events.emit('cart:changed', { 
      items: this.cart, 
      total: this.getTotal(), 
      count: this.getCount() 
    });
  }
}