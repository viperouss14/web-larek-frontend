import { Form } from './common/Form';
import { IOrderForm, PaymentMethods } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {

}
