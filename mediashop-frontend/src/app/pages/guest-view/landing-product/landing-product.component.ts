import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { afterRender, Component, Inject, PLATFORM_ID } from '@angular/core';
import { HomeService } from '../../home/service/home.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalProductComponent } from '../component/modal-product/modal-product.component';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../home/service/cart.service';

declare var $: any;
declare function MODAL_PRODUCT_DETAIL([]): any;
declare function LANDING_PRODUCT([]): any;
declare function MODAL_QUANTITY_LANDING([]): any;
@Component({
  selector: 'app-landing-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalProductComponent],
  templateUrl: './landing-product.component.html',
  styleUrl: './landing-product.component.css',
})
export class LandingProductComponent {
  PRODUCT_SLUG: any;
  PRODUCT_SELECTED: any;
  variation_selected: any = null;
  subvariation_selected: any;
  PRODUCTS_RELATED: any = null;
  product_selected_modal: any;
  CAMPAIGN_DISCOUNT_CODE: any;
  DISCOUNT_CAMPAIGN: any;

  currency: string = 'EUR';
  plus: number = 0;

  reviews: any = [];

  constructor(
    public homeService: HomeService,
    public activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: any,
    public cartService: CartService
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.PRODUCT_SLUG = res.slug;
    });

    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.CAMPAIGN_DISCOUNT_CODE = res.campaign_discount;
    });

    this.homeService
      .showProduct(this.PRODUCT_SLUG, this.CAMPAIGN_DISCOUNT_CODE)
      .subscribe({
        next: (res: any) => {
          this.PRODUCT_SELECTED = res.product;
          this.PRODUCTS_RELATED = res.products_related.data;
          this.DISCOUNT_CAMPAIGN = res.discount_campaign;
          this.reviews = res.reviews;
          if (this.DISCOUNT_CAMPAIGN) {
            this.PRODUCT_SELECTED.greater_discount = this.DISCOUNT_CAMPAIGN;
          }
        },
        error: (err) => {
          if (err.status === 404) {
            const toastrRef = this.toastr.error('Error', err.error.message);

            this.router.navigate(['/']);

            setTimeout(() => {
              this.toastr.clear(toastrRef.toastId); // clean the toastr after 5 seconds
            }, 5000);
          } else {
            const toastrRef = this.toastr.error(
              'Error',
              'Error en la operación',
              {
                timeOut: 5000,
              }
            );
          }
        },
      });
    afterRender(() => {
      setTimeout(() => {
        MODAL_PRODUCT_DETAIL($);
        LANDING_PRODUCT($);
      }, 50);
      this.currency = this.cookieService.get('currency')
        ? this.cookieService.get('currency')
        : 'EUR';
    });
  }

  // its necessary to load script from main.js after DOM is loaded
  ngAfterViewInit(): void {
    if (typeof MODAL_QUANTITY_LANDING === 'function') {
      setTimeout(() => {
        MODAL_QUANTITY_LANDING($);
      }, 50);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only execute this in the browser
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  }

  // Flash discounts
  getNewPrice(product: any, DISCOUNTS_FLASH_PARAMETER: any) {
    if (this.currency == 'EUR') {
      if (DISCOUNTS_FLASH_PARAMETER.type_discount == 1) {
        // type % dsicount
        return (
          product.price_eur +
          this.plus -
          (product.price_eur + this.plus) *
            (DISCOUNTS_FLASH_PARAMETER.discount * 0.01)
        ).toFixed(2);
      } else {
        // EUR fix amount
        return (
          product.price_eur +
          this.plus -
          DISCOUNTS_FLASH_PARAMETER.discount
        ).toFixed(2);
      }
    } else {
      if (DISCOUNTS_FLASH_PARAMETER.type_discount == 1) {
        // type % dsicount
        return (
          product.price_usd +
          this.plus -
          (product.price_usd + this.plus) *
            (DISCOUNTS_FLASH_PARAMETER.discount * 0.01)
        ).toFixed(2);
      } else {
        // USD fix amount
        return (
          product.price_usd +
          this.plus -
          DISCOUNTS_FLASH_PARAMETER.discount
        ).toFixed(2);
      }
    }
  }

  // Calculate final price
  getTotalPrice(product: any) {
    if (product.greater_discount) {
      return this.getNewPrice(product, product.greater_discount);
    }
    if (this.currency == 'EUR') {
      return product.price_eur + this.plus;
    } else {
      return product.price_usd + this.plus;
    }
  }

  getTotalCurrency(product: any) {
    if (this.currency == 'EUR') {
      return product.price_eur;
    } else {
      return product.price_usd;
    }
  }

  selectedVariation(variation: any) {
    this.variation_selected = null;
    this.subvariation_selected = null;
    this.plus = 0;

    setTimeout(() => {
      this.plus += variation.add_price;
      this.variation_selected = variation;
      MODAL_PRODUCT_DETAIL($);
    }, 50);
  }

  selectedSubvariation(subvariation: any) {
    this.subvariation_selected = null;
    this.plus = this.variation_selected.add_price;

    setTimeout(() => {
      this.plus += subvariation.add_price;
      this.subvariation_selected = subvariation;
    }, 50);
  }

  openDetailModal(product: any) {
    this.product_selected_modal = null;

    setTimeout(() => {
      this.product_selected_modal = product;
    }, 50);
  }

  addCart() {
    if (!this.cartService.authService.user) {
      this.toastr.error('Error', 'Ingrese a la tienda');
      this.router.navigateByUrl('/login');
      return;
    }

    let product_variation_id = null;
    // check if product has variations and subvariations which must be choose them before to add it to cart
    if (this.PRODUCT_SELECTED.variations.length > 0) {
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
      this.PRODUCT_SELECTED.variations.length > 0 &&
      this.variation_selected &&
      this.variation_selected.subvariations.length == 0
    ) {
      product_variation_id = this.variation_selected.id;
    }

    // product has got some subvariations
    if (
      this.PRODUCT_SELECTED.variations.length > 0 &&
      this.variation_selected &&
      this.variation_selected.subvariations.length > 0
    ) {
      product_variation_id = this.subvariation_selected.id;
    }

    let greater_discount = null;

    if (this.PRODUCT_SELECTED.greater_discount) {
      greater_discount = this.PRODUCT_SELECTED.greater_discount;
    }

    let data = {
      product_id: this.PRODUCT_SELECTED.id,
      product_title: this.PRODUCT_SELECTED.title,
      discount: greater_discount ? greater_discount.discount : null,
      type_discount: greater_discount ? greater_discount.type_discount : null,
      type_campaign: greater_discount ? greater_discount.type_campaign : null,
      code_coupon: null,
      code_discount: greater_discount ? greater_discount.code : null,
      product_variation_id: product_variation_id,
      quantity: $('#tp-cart-input-val').val(),
      price_unit:
        this.currency == 'EUR'
          ? this.PRODUCT_SELECTED.price_eur
          : this.PRODUCT_SELECTED.price_usd,
      subtotal: this.getTotalPrice(this.PRODUCT_SELECTED),
      total:
        this.getTotalPrice(this.PRODUCT_SELECTED) *
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
