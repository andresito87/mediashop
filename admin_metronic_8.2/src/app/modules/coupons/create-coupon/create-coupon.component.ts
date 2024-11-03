import { Component } from '@angular/core';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss'],
})
export class CreateCouponComponent {
  code: any;
  type_discount: number = 1; // 1 is %, 2 is fixed amount
  discount: number = 0;
  type_count: number = 1; // 1 unlimited discounts, 2 limited discounts
  num_uses: number = 0;
  type_coupon: number = 1;
  product_id: any;
  categorie_id: any;
  brand_id: any;

  isLoading$: any;

  categories_first: any = [];
  products: any = [];
  brands: any = [];
  products_add: any = [];
  categories_add: any = [];
  brands_add: any = [];

  constructor() {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }

  changeTypeCount(value: number) {
    this.type_count = value;
  }

  changeTypeCoupon(value: number) {
    this.type_coupon = value;
  }

  save() {}

  removeProduct(product: any) {}

  removeCategorie(categorie: any) {}

  removeBrand(brand: any) {}
}
