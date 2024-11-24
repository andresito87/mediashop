import { CartItem } from './interfaces/cart-item';
import { afterRender, Component, OnInit } from '@angular/core';
import { HomeService } from './service/home.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ModalProductComponent } from '../guest-view/component/modal-product/modal-product.component';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from './service/cart.service';
import { ToastrService } from 'ngx-toastr';

declare function SLIDER_PRINCIPAL([]: any): any;
declare var $: any;
declare function DATA_VALUES([]): any;
declare function PRODUCTS_SLIDER_HOME([]): any;
declare function MODAL_PRODUCT_DETAIL([]): any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  SLIDERS: any = [];
  CATEGORIES_RANDOMS: any = [];

  TRENDING_PRODUCTS_NEW: any = [];
  TRENDING_PRODUCTS_FEATURED: any = [];
  TRENDING_PRODUCTS_TOP_SELLER: any = [];
  PRODUCTS_ELECTRONICS_GADGETS: any = [];
  PRODUCTS_SLIDER: any = [];

  BANNERS_SECONDARIES: any = [];
  BANNERS_TERTIARIES: any = [];

  DISCOUNT_PRODUCTS_COLUMN: any = [];
  FEATURED_PRODUCTS_COLUMN: any = [];
  SELLING_PRODUCTS_COLUMN: any = [];

  DISCOUNTS_FLASH: any;
  DISCOUNTS_FLASH_PRODUCTS: any = [];

  product_selected: any = null;
  variation_selected: any = null;
  currency: string = 'EUR';

  constructor(
    public homeService: HomeService,
    private cookieService: CookieService,
    public cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.homeService.home().subscribe((res: any) => {
      this.SLIDERS = res.sliders_principal;
      this.CATEGORIES_RANDOMS = res.categories_random;
      this.TRENDING_PRODUCTS_NEW = res.products_trending_new.data;
      this.TRENDING_PRODUCTS_FEATURED = res.products_trending_featured.data;
      this.BANNERS_SECONDARIES = res.sliders_secondaries;
      this.TRENDING_PRODUCTS_TOP_SELLER =
        res.products_trending_top_sellers.data;
      this.PRODUCTS_ELECTRONICS_GADGETS = res.products_electronics_gadgets.data;
      this.PRODUCTS_SLIDER = res.products_slider.data;
      this.BANNERS_TERTIARIES = res.sliders_tertiaries;

      this.DISCOUNT_PRODUCTS_COLUMN = res.discount_products_column.data;
      this.FEATURED_PRODUCTS_COLUMN = res.featured_products_column.data;
      this.SELLING_PRODUCTS_COLUMN = res.selling_products_column.data;

      this.DISCOUNTS_FLASH = res.discounts_flash;
      this.DISCOUNTS_FLASH_PRODUCTS = res.discounts_flash_products;
    });

    // it's necessary ejecute these functions to sincronize html template and angular app
    afterRender(() => {
      setTimeout(() => {
        SLIDER_PRINCIPAL($);
        DATA_VALUES($);
        PRODUCTS_SLIDER_HOME($);
        setTimeout(() => {
          this.BANNERS_SECONDARIES.forEach((banner: any, index: number) => {
            if (index == 0) {
              this.getTitleBannerSecondary(
                banner,
                'title-banner-secondary-' + banner.id
              );
            } else {
              this.getTitleBannerSecondary(
                banner,
                'title-banner-secondary-small-' + banner.id
              );
            }
          });

          this.SLIDERS.forEach((slider: any) => {
            this.getLabelSlider(slider);
            this.getSubtitleSlider(slider);
          });
        }, 25);
      }, 50);
    });
  }

  ngOnInit(): void {
    this.currency = this.cookieService.get('currency')
      ? this.cookieService.get('currency')
      : 'EUR';
  }

  addCart(product: any, discount_flash: any = null) {
    if (!this.cartService.authService.user) {
      this.toastr.error('Error', 'Ingrese a la tienda');
      this.router.navigateByUrl('/login');
      return;
    }

    // check if product has variations and open jquery modal window
    if (product.variations.length > 0) {
      $('#productQuickViewModal').modal('show');
      this.openDetailProduct(product);
      return;
    }

    let greater_discount = null;

    if (product.greater_discount) {
      greater_discount = product.greater_discount;
    }

    let data = {
      product_id: product.id,
      discount: greater_discount ? greater_discount.discount : null,
      type_discount: greater_discount ? greater_discount.type_discount : null,
      type_campaign: greater_discount ? greater_discount.type_campaign : null,
      code_coupon: null,
      code_discount: greater_discount ? greater_discount.code : null,
      product_variation_id: null,
      quantity: 1,
      price_unit: product.price_eur,
      subtotal: this.getTotalPrice(product),
      total: this.getTotalPrice(product) * 1,
      currency: this.currency,
    };

    console.log('Data', data);

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

  getLabelSlider(slider: any) {
    let miDiv: any = document.getElementById('label-' + slider.id);
    miDiv.innerHTML = slider.label;
    return '';
  }

  getSubtitleSlider(slider: any) {
    let miDiv: any = document.getElementById('subtitle-' + slider.id);
    miDiv.innerHTML = slider.subtitle;
    return '';
  }

  getTitleBannerSecondary(banner: any, idBanner: string) {
    let miDiv: any = document.getElementById(idBanner);
    miDiv.innerHTML = banner.title;
    return '';
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

  openDetailProduct(product: any, discount_flash: any = null) {
    this.product_selected = null;
    this.variation_selected = null;

    setTimeout(() => {
      setTimeout(() => {
        if (discount_flash) {
          this.product_selected.greater_discount = discount_flash;
        }
      }, 25);

      this.product_selected = product;
      //MODAL_PRODUCT_DETAIL($);
    }, 50);
  }

  selectedVariation(variation: any) {
    this.variation_selected = null;

    setTimeout(() => {
      this.variation_selected = variation;
      MODAL_PRODUCT_DETAIL($);
    }, 50);
  }
}
