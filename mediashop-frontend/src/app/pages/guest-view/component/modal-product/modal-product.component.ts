import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../home/service/cart.service';
import { CookieService } from 'ngx-cookie-service';

declare var $: any;
declare function MODAL_PRODUCT_DETAIL([]): any;
declare function MODAL_QUANTITY([]): any;
@Component({
  selector: 'app-modal-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-product.component.html',
  styleUrl: './modal-product.component.css',
})
export class ModalProductComponent {
  //comes from its parent component
  @Input() product_selected: any;
  variation_selected: any;
  subvariation_selected: any;

  currency: string = 'EUR';

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    public cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // set the currency in this component
    this.currency = this.cookieService.get('currency')
      ? this.cookieService.get('currency')
      : 'EUR';
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(() => {
      MODAL_PRODUCT_DETAIL($);
      MODAL_QUANTITY($);
    }, 50);
  }

  selectedVariation(variation: any) {
    this.variation_selected = null;
    this.subvariation_selected = null;

    setTimeout(() => {
      this.variation_selected = variation;
      MODAL_PRODUCT_DETAIL($);
    }, 50);
  }

  selectedSubvariation(subvariation: any) {
    this.subvariation_selected = null;

    setTimeout(() => {
      this.subvariation_selected = subvariation;
    }, 50);
  }

  // Flash discounts
  getNewPrice(product: any, DISCOUNTS_FLASH_PARAMETER: any) {
    if (DISCOUNTS_FLASH_PARAMETER.type_discount == 1) {
      // type % dsicount
      return (
        product.price_eur -
        product.price_eur * (DISCOUNTS_FLASH_PARAMETER.discount * 0.01)
      ).toFixed(2);
    } else {
      // EUR/PEN fix amount
      return (product.price_eur - DISCOUNTS_FLASH_PARAMETER.discount).toFixed(
        2
      );
    }
  }

  // Calculate final price
  getTotalPrice(product: any) {
    if (product.greater_discount) {
      return this.getNewPrice(product, product.greater_discount);
    }
    return product.price_eur;
  }

  addCart() {
    if (!this.cartService.authService.user) {
      this.toastr.error('Error', 'Ingrese a la tienda');
      this.router.navigateByUrl('/login');
      return;
    }

    let product_variation_id = null;
    // check if product has variations and subvariations which must be choose them before to add it to cart
    if (this.product_selected.variations.length > 0) {
      if (!this.variation_selected) {
        this.toastr.error('Error', 'Necesitas seleccionar una variación');
        return;
      }
      if (
        this.variation_selected &&
        this.variation_selected.subvariations.length > 0
      ) {
        if (!this.subvariation_selected) {
          this.toastr.error(
            'Error',
            'Necesitas seleccionar la variación anidada correspondiente'
          );
        }
      }
    }

    // product hasn't got subvariations
    if (
      this.product_selected.variations.length > 0 &&
      this.variation_selected &&
      this.variation_selected.subvariations.length == 0
    ) {
      product_variation_id = this.variation_selected.id;
    }

    // product has got some subvariations
    if (
      this.product_selected.variations.length > 0 &&
      this.variation_selected &&
      this.variation_selected.subvariations.length > 0
    ) {
      product_variation_id = this.subvariation_selected.id;
    }

    let greater_discount = null;

    if (this.product_selected.greater_discount) {
      greater_discount = this.product_selected.greater_discount;
    }

    let data = {
      product_id: this.product_selected.id,
      product_title: this.product_selected.title,
      discount: greater_discount ? greater_discount.discount : null,
      type_discount: greater_discount ? greater_discount.type_discount : null,
      type_campaign: greater_discount ? greater_discount.type_campaign : null,
      code_coupon: null,
      code_discount: greater_discount ? greater_discount.code : null,
      product_variation_id: product_variation_id,
      quantity: $('#tp-cart-input-val').val(),
      price_unit: this.product_selected.price_eur,
      subtotal: this.getTotalPrice(this.product_selected),
      total:
        this.getTotalPrice(this.product_selected) *
        $('#tp-cart-input-val').val(),
      currency: this.currency,
    };

    this.cartService.registerCart(data).subscribe({
      next: (res: any) => {
        this.cartService.changeCart(res.cart);
        this.toastr.success(
          'Éxito',
          'El producto se ha agregado al carrito de compra'
        );
      },
      error: (err: any) => {
        this.toastr.error('Error', err.error.message);
      },
    });
  }
}
