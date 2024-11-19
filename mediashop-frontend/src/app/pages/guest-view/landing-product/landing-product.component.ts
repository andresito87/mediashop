import { ToastrService } from 'ngx-toastr';
import { afterNextRender, Component } from '@angular/core';
import { HomeService } from '../../home/service/home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalProductComponent } from '../component/modal-product/modal-product.component';

declare var $: any;
declare function MODAL_PRODUCT_DETAIL([]): any;
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

  constructor(
    public homeService: HomeService,
    public activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.PRODUCT_SLUG = res.slug;
    });
    this.homeService.showProduct(this.PRODUCT_SLUG).subscribe({
      next: (res: any) => {
        this.PRODUCT_SELECTED = res.product;
        this.PRODUCTS_RELATED = res.products_related.data;
      },
      error: (err) => {
        if (err.status == 404) {
          console.log('Error', err);
          this.toastr.error('Error', err.error.message);
          this.router.navigateByUrl('/');
        } else {
          this.toastr.error('Error', 'Error en la operación');
        }
      },
    });
    afterNextRender(() => {
      setTimeout(() => {
        MODAL_PRODUCT_DETAIL($);
      }, 50);
    });
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
