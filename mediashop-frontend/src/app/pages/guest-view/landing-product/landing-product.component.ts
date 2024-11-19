import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { afterRender, Component, Inject, PLATFORM_ID } from '@angular/core';
import { HomeService } from '../../home/service/home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalProductComponent } from '../component/modal-product/modal-product.component';
import { CookieService } from 'ngx-cookie-service';

declare var $: any;
declare function MODAL_PRODUCT_DETAIL([]): any;
declare function LANDING_PRODUCT([]): any;
@Component({
  selector: 'app-landing-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalProductComponent],
  templateUrl: './landing-product.component.html',
  styleUrl: './landing-product.component.css',
})
export class LandingProductComponent {
  PRODUCT_SLUG: any;
  PRODUCT_SELECTED: any;
  variation_selected: any = null;
  PRODUCTS_RELATED: any = null;
  product_selected_modal: any;
  CAMPAIGN_DISCOUNT_CODE: any;
  DISCOUNT_CAMPAIGN: any;

  currency: string = 'EUR';

  constructor(
    public homeService: HomeService,
    public activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: any
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
          product.price_eur -
          product.price_eur * (DISCOUNTS_FLASH_PARAMETER.discount * 0.01)
        ).toFixed(2);
      } else {
        // EUR fix amount
        return (product.price_eur - DISCOUNTS_FLASH_PARAMETER.discount).toFixed(
          2
        );
      }
    } else {
      if (DISCOUNTS_FLASH_PARAMETER.type_discount == 1) {
        // type % dsicount
        return (
          product.price_usd -
          product.price_usd * (DISCOUNTS_FLASH_PARAMETER.discount * 0.01)
        ).toFixed(2);
      } else {
        // USD fix amount
        return (product.price_usd - DISCOUNTS_FLASH_PARAMETER.discount).toFixed(
          2
        );
      }
    }
  }

  // Calculate final price
  getTotalPrice(product: any) {
    if (product.greater_discount) {
      return this.getNewPrice(product, product.greater_discount);
    }
    if (this.currency == 'EUR') {
      return product.price_eur;
    } else {
      return product.price_usd;
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

    setTimeout(() => {
      this.variation_selected = variation;
      MODAL_PRODUCT_DETAIL($);
    }, 50);
  }

  openDetailModal(product: any) {
    this.product_selected_modal = null;

    setTimeout(() => {
      this.product_selected_modal = product;
    }, 50);
  }
}
