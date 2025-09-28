import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/ServerApi/larekServer';
import { Buyer } from './components/Models/buyer';
import { Cart } from './components/Models/cart';
import { Catalog } from './components/Models/catalog';
import { IApi, IProduct, IOrder } from './types';
import { Basket } from './components/View/basket';
import { CardBasket } from './components/View/cardBasket';
import { CardCatalog } from './components/View/cardCatalog';
import { CardPreview } from './components/View/cardModalPreview';
import { Gallery } from './components/View/gallery';
import { Modal } from './components/View/modal';
import { HeaderBasket } from './components/View/headerBasket';
import { FormOrder } from './components/View/formOrder';
import { FormUserInfo } from './components/View/formUserInfo';
import { OrderSuccess } from './components/View/orderSuccess';

/**
 * Константы / переменные
 */
const events = new EventEmitter();
const products = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const api: IApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const container: HTMLElement = ensureElement<HTMLElement>('.page');
const headerElement: HTMLElement = ensureElement<HTMLElement>('.header', container);
const header = new HeaderBasket(headerElement, events);
const cardCatalogTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-catalog', container);
const galleryElement: HTMLElement = ensureElement<HTMLElement>('.gallery', container);
const gallery = new Gallery(galleryElement);
const modalElement: HTMLElement = ensureElement<HTMLElement>('#modal-container', container);
const modal = new Modal(modalElement, events);
const cardPreviewTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview', container);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const basketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#basket', container);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const cardBasketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-basket', container);
const orderTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#order', container);
const order = new FormOrder(cloneTemplate(orderTemplate), events);
const contactsTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#contacts', container);
const contacts = new FormUserInfo(cloneTemplate(contactsTemplate), events);
const successTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#success', container);
const success = new OrderSuccess(cloneTemplate(successTemplate), events);

let isBasketActive = false;

/** 
 * загрузка товаров
*/
(async () => {
    try {
        const productsList = await webLarekApi.getProducts();
        products.setItems(productsList);
    } catch (error) {
        console.error('Ошибка загрузки данных с сервера', error);
    }
})();

/**
 * События
 */
// Каталог
events.on('products:changed', () => {
    const itemsCards = products.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', { item, source: 'catalog'}),
        });
        return card.render(item);
    });
    gallery.render({catalog: itemsCards});
});

//Карточки
events.on('card:select', (data: { item:IProduct, source?: 'catalog' | 'basket'}) => {
    if (data.source === 'catalog') {
        modal.open();
        cardPreview.data = data.item;
        modal.content = cardPreview.render();
    }
});

events.on('product:selected', (data:{ item: IProduct, source: 'catalog' | 'basket'}) => {
    if (isBasketActive) return;
    if (data.source !== 'catalog') return;

    modal.open();

    cardPreview.title = data.item.title;
    cardPreview.price = data.item.price ?? 0;
    cardPreview.image = data.item.image;
    cardPreview.category = data.item.category;
    cardPreview.description = data.item.description;

    if (data.item.price) {
        if (cart.hasItem(data.item.id)) {
            cardPreview.buttonState = 'remove';
        } else {
            cardPreview.buttonState = 'add';
        }
    } else {
        cardPreview.buttonState = 'disabled';
    };

    modal.content = cardPreview.render();
});

events.on('card:add', ({item}: { item: IProduct}) => {
    cart.addItem(item);
});

events.on('card:remove', ({item}: { item: IProduct}) => {
  cart.deleteItem(item);
});

// Модалки
events.on('modal:close', () => {
    modal.close();
    isBasketActive = false;
});

//Корзина
events.on('basket:open', () => {
    isBasketActive = true;
    modal.open();
    renderBasket();
    modal.content = basket.render();
});

events.on('order', () => {
    validateFormOrder();
    modal.open();
    isBasketActive = false;
    modal.content = order.render();
});

events.on('cart:changed', () => {
    header.counter = cart.getCount();
    renderBasket();
    if (isBasketActive) {
        modal.content = basket.render();
    };
});

// Заказ
events.on('order:payment',(data: {payment: 'card' | 'cash'}) => {
    buyer.setPayment(data.payment as 'card' | 'cash');
    validateFormOrder();
});

events.on('order:address', (data: {address: string}) => {
    buyer.setAddress(data.address);
    validateFormOrder();
});

events.on('order:next', () => {
    validateFormUserInfo();
    modal.content = contacts.render();
    isBasketActive = false;
});

// Данные пользователя
events.on('contacts:email', (data: {email: string}) => {
    buyer.setEmail(data.email);
    validateFormUserInfo();
});

events.on('contacts:phone', (data: { phone: string}) => {
    buyer.setPhone(data.phone);
    validateFormUserInfo();
});

/**
 * Функции
 */
// Окно корзины
function renderBasket() {
    basket.products = cart.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), events, {
            onRemove: () => {
                cart.deleteItem(item);
            }
        });
        card.index = index + 1;
        card.title = item.title;
        card.price = item.price ?? 0;
        return card.render();
    });
    basket.total = cart.getTotal();
};

//Валидация заказа
function validateFormOrder() {
    const payValid = buyer.validatePayment();
    const addressValid = buyer.validateAddress();
    const isValid = payValid.isValid && addressValid.isValid && cart.getCount() > 0;
    const error = !payValid.isValid ? payValid.error : !addressValid.isValid ? addressValid.error : cart.getCount() === 0 ? 'Корзина пуста' : undefined;
    
    order.buttonState = isValid;
    order.error = error ?? '';
}

//Валидация контактной информации
function validateFormUserInfo() {
    const emailValid = buyer.validateEmail();
    const phoneValid = buyer.validatePhone();
    const isValid = emailValid.isValid && phoneValid.isValid;
    const error = !emailValid.isValid ? emailValid.error : phoneValid.error;

    contacts.buttonState = isValid;
    contacts.error = error ?? '';
}

/**
 * Создание заказа
 */
events.on('order:submit', async () => {
    const buyerData = buyer.getData();
    const itemsCart = cart.getItems();

   if (!buyerData.payment || !buyerData.address || !buyerData.email || !buyerData.phone || itemsCart.length === 0 ) {
        contacts.error = 'заполните все поля';
        return;
    };

    const orderRequest: IOrder = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        total: cart.getTotal(),
        items: itemsCart.map((p) => p.id),
    };

    try {
        const orderResponse = await webLarekApi.postOrder(orderRequest);
        success.total = orderResponse.total ?? cart.getTotal();
        if (!modal.isOpen()) {
            modal.open();
        };
        modal.content = success.render();
        isBasketActive = false;
        cart.clear();
        buyer.clearData();
    } catch (e) {
        order.error = 'Ошибка оформления заказа';
    };
});