import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
  protected productsList: IProduct[];
  protected selectedProduct: IProduct | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.productsList = [];
    this.selectedProduct = null;
    this.events = events;
  }

  setItems(products: IProduct[]): void {
    this.productsList = products;
    this.events.emit('products:changed', this.productsList);
  }

  setSelectedItem(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('product:selected', this.selectedProduct);
  }

  getItems(): IProduct[] {
    return this.productsList;
  }

  getItemById(id: string): IProduct | undefined {
    return this.productsList.find(product => product.id === id);
  }

  getSelectedItem(): IProduct | null {
    return this.selectedProduct;
  }
}
