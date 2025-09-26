import { IApi, IProduct, IOrder, IOrderConfirmation } from "../../types";

export class WebLarekApi {
    protected api: IApi;
    
    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<{total: number, items: IProduct[]}>('/product');
        return response.items;
    }

    async postOrder(order: IOrder): Promise<IOrderConfirmation> {
        return this.api.post<IOrderConfirmation>('/order', order);
    }
}
