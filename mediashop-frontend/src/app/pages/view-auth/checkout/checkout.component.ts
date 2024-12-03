import { CookieService } from 'ngx-cookie-service';
import { CartItem } from '../../home/interfaces/cart-item';
import { CartService } from './../../home/service/cart.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  listCarts: any = [];
  totalCarts: number = 0;
  currency: string = 'EUR';

  constructor(
    public cartService: CartService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.currency = this.cookieService.get('currency')
      ? this.cookieService.get('currency')
      : 'EUR';
    this.cartService.currentDataCart$.subscribe((res: any) => {
      this.listCarts = res;
      this.totalCarts = this.listCarts.reduce(
        (sum: number, item: CartItem) => sum + item.total,
        0
      );
    });
  }
}
