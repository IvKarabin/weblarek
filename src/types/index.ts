export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'card' | 'cash';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IBuyer {
    payment: TPayment;
    items: string[];
    total: number;
}

export interface IOrderConfirmation {
    id: string;
    total: number;
    error?:string;
}