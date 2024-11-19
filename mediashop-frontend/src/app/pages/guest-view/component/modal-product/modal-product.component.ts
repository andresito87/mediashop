import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var $: any;
declare function MODAL_PRODUCT_DETAIL([]): any;
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

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(() => {
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
}
