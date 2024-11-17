import { afterNextRender, Component, OnInit } from '@angular/core';
import { HomeService } from './service/home.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

declare function SLIDER_PRINCIPAL([]: any): any;
declare var $: any;
declare function DATA_VALUES([]): any;
declare function PRODUCTS_SLIDER_HOME([]): any;
declare function MODAL_PRODUCT_DETAIL([]): any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  constructor(public homeService: HomeService) {
    afterNextRender(() => {
      this.homeService.home().subscribe((res: any) => {
        console.log(res);
        this.SLIDERS = res.sliders_principal;
        this.CATEGORIES_RANDOMS = res.categories_random;
        this.TRENDING_PRODUCTS_NEW = res.products_trending_new.data;
        this.TRENDING_PRODUCTS_FEATURED = res.products_trending_featured.data;
        this.BANNERS_SECONDARIES = res.sliders_secondaries;
        this.TRENDING_PRODUCTS_TOP_SELLER =
          res.products_trending_top_sellers.data;
        this.PRODUCTS_ELECTRONICS_GADGETS =
          res.products_electronics_gadgets.data;
        this.PRODUCTS_SLIDER = res.products_slider.data;
        this.BANNERS_TERTIARIES = res.sliders_tertiaries;

        this.DISCOUNT_PRODUCTS_COLUMN = res.discount_products_column.data;
        this.FEATURED_PRODUCTS_COLUMN = res.featured_products_column.data;
        this.SELLING_PRODUCTS_COLUMN = res.selling_products_column.data;

        this.DISCOUNTS_FLASH = res.discounts_flash;
        this.DISCOUNTS_FLASH_PRODUCTS = res.discounts_flash_products;

        // it's necessary ejecute these functions to sincronize html template  and angular app
        setTimeout(() => {
          SLIDER_PRINCIPAL($);
          DATA_VALUES($);
          PRODUCTS_SLIDER_HOME($);
        }, 50);
      });
    });
  }

  ngOnInit(): void {}

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

  getTotalPrice(product: any) {
    if (product.greater_discount) {
      return this.getNewPrice(product, product.greater_discount);
    }
    return product.price_eur;
  }

  openDetailProduct(product: any) {
    this.product_selected = null;
    this.variation_selected = null;

    setTimeout(() => {
      this.product_selected = product;
      MODAL_PRODUCT_DETAIL($);
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
