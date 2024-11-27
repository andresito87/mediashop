import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../home/service/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { CartItem } from '../../home/interfaces/cart-item';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  currency: string = 'EUR';

  listCarts: any = [];
  totalCarts: number = 0;

  code_coupon: string = '';

  constructor(
    public cartService: CartService,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currency = this.cookieService.get('currency')
      ? this.cookieService.get('currency')
      : 'EUR';

    this.cartService.currentDataCart$.subscribe((res: CartItem[]) => {
      this.listCarts = res;
      this.totalCarts = this.listCarts.reduce(
        (sum: number, item: CartItem) => sum + item.total,
        0
      );
    });
  }

  deleteCart(cart: any) {
    this.cartService.deleteCart(cart.id).subscribe((res: any) => {
      this.toastr.info(
        'Eliminación',
        'Se ha eliminado el producto ' +
          cart.product.title +
          ' del carrito de compra'
      );
      this.cartService.removeCart(cart.id);
    });
  }

  minusQuantity(cart: CartItem) {
    if (cart.quantity == 1) {
      this.toastr.error('Validación', 'No se puede disminuir más el producto');
      return;
    }
    cart.quantity--;
    cart.total = parseFloat((cart.subtotal * cart.quantity).toFixed(2));
    this.cartService.updateCart(cart.id, cart).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.cartService.changeCart(res.body.cart);
          this.toastr.info(
            'Información',
            'Se actualizado la cantidad del producto ' +
              res.body.cart.product.title
          );
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Validación', err.error.message);
      },
    });
  }
  plusQuantity(cart: CartItem) {
    let oldQuantity = cart.quantity;
    cart.quantity++;
    cart.total = parseFloat((cart.subtotal * cart.quantity).toFixed(2));
    this.cartService.updateCart(cart.id, cart).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.cartService.changeCart(res.body.cart);
          this.toastr.info(
            'Información',
            'Se actualizado la cantidad del producto ' +
              res.body.cart.product.title
          );
        }
      },
      error: (err) => {
        cart.quantity = oldQuantity;
        cart.total = parseFloat((cart.subtotal * cart.quantity).toFixed(2));
        console.log(err);
        this.toastr.error('Validación', err.error.message);
      },
    });
  }

  applyCoupon() {
    if (!this.code_coupon) {
      this.toastr.error(
        'Validación',
        'Se necesita ingresar un código de cupón'
      );
      return;
    }

    let data = {
      code_coupon: this.code_coupon,
    };
    this.cartService.applyCoupon(data).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.cartService.resetCart();
          this.cartService.listCart().subscribe((res: any) => {
            res.carts.data.forEach((item: CartItem) => {
              this.cartService.changeCart(item);
            });
          });
          this.toastr.success('Éxito', res.body.message);
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Validación', err.error.message);
      },
    });
  }
}
