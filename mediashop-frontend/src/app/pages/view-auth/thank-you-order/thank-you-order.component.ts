import { afterRender, Component } from '@angular/core';
import { CartService } from '../../home/service/cart.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
declare function MODAL_PRODUCT_DETAIL([]): any;
@Component({
  selector: 'app-thank-you-order',
  standalone: true,
  imports: [],
  templateUrl: './thank-you-order.component.html',
  styleUrl: './thank-you-order.component.css',
})
export class ThankYouOrderComponent {
  orderSelected: any;
  orderSelectedId: any;

  constructor(
    public cartService: CartService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((res: any) => {
      this.orderSelectedId = res.orderId;
    });

    this.cartService.showOrder(this.orderSelectedId).subscribe((res: any) => {
      this.orderSelected = res.sale;
    });

    // it's neccesary to apply styles with jquery
    afterRender(() => {
      MODAL_PRODUCT_DETAIL($);
    });
  }
}
