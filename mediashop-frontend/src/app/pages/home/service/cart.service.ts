import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../config/config';
import { CartItem } from '../interfaces/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cart = new BehaviorSubject<CartItem[]>([]);
  public currentDataCart$ = this.cart.asObservable();

  constructor(public authService: AuthService, public http: HttpClient) {}

  changeCart(data: CartItem) {
    let listCart = this.cart.getValue();
    let index = listCart.findIndex(
      (item: CartItem) => item.product_id == data.product_id
    );

    // check if cartitem is in the cart
    if (index !== -1) {
      // update data of cart item
      listCart[index] = data;
    } else {
      // add new cartitem to cart
      listCart.unshift(data);
    }

    // send info to all observers of cart
    this.cart.next(listCart);
  }

  resetCart() {
    let listCart: CartItem[] = [];
    this.cart.next(listCart);
  }

  removeCart(product_id: string) {
    let listCart = this.cart.getValue();
    let index = listCart.findIndex((item: any) => item.id == product_id);

    // check if cartitem is in the cart
    if (index !== -1) {
      // delete cartitem
      listCart.splice(index, 1);
    }

    // send info to all observers of cart
    this.cart.next(listCart);
  }

  listCart() {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/carts/';

    return this.http.get(URL, { headers: headersAdded });
  }

  registerCart(data: any) {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/carts';

    return this.http.post(URL, data, { headers: headersAdded });
  }

  updateCart(cart_id: string, data: CartItem) {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/carts/' + cart_id;

    return this.http.put(URL, data, { headers: headersAdded });
  }

  deleteCart(cart_id: string) {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/carts/' + cart_id;

    return this.http.delete(URL, { headers: headersAdded });
  }
}
