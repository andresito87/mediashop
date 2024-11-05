import { Component } from '@angular/core';
import { DiscountsService } from '../service/discounts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss'],
})
export class CreateDiscountComponent {
  type_discount: number = 1; // 1 is %, 2 is fixed amount
  discount: number = 0;
  type_campaign: number = 1; // 1 normal, 2 flash, 3 link
  type_coupon: number = 1;
  product_id: any;
  categorie_id: any;
  brand_id: any;
  start_date: any;
  end_date: any;

  isLoading$: any;

  products: any = [];
  categories_first: any = [];
  brands: any = [];
  products_add: any = [];
  categories_add: any = [];
  brands_add: any = [];

  constructor(
    public discountsService: DiscountsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.isLoading$ = this.discountsService.isLoading$;
    // use coupons config endpoint to get the data
    this.discountsService.configDiscounts().subscribe((res: any) => {
      this.products = res.products;
      this.categories_first = res.categories;
      this.brands = res.brands;
    });
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }

  changeTypeCampaign(value: number) {
    this.type_campaign = value;
  }

  changeTypeCoupon(value: number) {
    this.type_coupon = value;
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = null;
    this.categorie_id = null;
    this.brand_id = null;
  }

  save() {
    if (!this.discount) {
      this.toastr.error('Validación', 'Ingrese todos los campos');
      return;
    }

    if (this.type_coupon == 1 && this.products_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos un producto'
      );
    }

    if (this.type_coupon == 2 && this.categories_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una categoría'
      );
    }

    if (this.type_coupon == 3 && this.brands_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una marca'
      );
    }

    let data = {
      type_discount: this.type_discount,
      discount: this.discount,
      type_coupon: this.type_coupon,
      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
    };

    this.discountsService.createDiscounts(data).subscribe({
      next: (res: any) => {
        this.toastr.success('Éxito', 'Cupón guardado correctamente');
        // clean form
        this.type_discount = 1;
        this.discount = 0;
        this.type_coupon = 1;
        this.products_add = [];
        this.categories_add = [];
        this.brands_add = [];
        this.product_id = null;
        this.categorie_id = null;
        this.brand_id = null;
      },
      error: (err) => {
        this.toastr.error('Error', err.error.message);
      },
    });
  }

  addProduct() {
    if (!this.product_id) {
      this.toastr.error('Validación', 'Es necesario seleccionar un producto.');
      return;
    }

    const index = this.products_add.findIndex(
      (product: any) => product.id == this.product_id
    );
    if (index != -1) {
      this.toastr.error('Validación', 'El producto ya está en la lista.');
      return;
    }

    const data = this.products.find(
      (product: any) => product.id == this.product_id
    );

    if (data) {
      this.products_add.push(data);
    }
  }

  addCategorie() {
    if (!this.categorie_id) {
      this.toastr.error(
        'Validación',
        'Es necesario seleccionar una categoría.'
      );
      return;
    }

    const index = this.categories_add.findIndex(
      (categorie: any) => categorie.id == this.categorie_id
    );
    if (index != -1) {
      this.toastr.error('Validación', 'La categoría ya está en la lista.');
      return;
    }

    const data = this.categories_first.find(
      (categorie: any) => categorie.id == this.categorie_id
    );

    if (data) {
      this.categories_add.push(data);
    }
  }

  addBrand() {
    if (!this.brand_id) {
      this.toastr.error('Validación', 'Es necesario seleccionar una marca.');
      return;
    }

    const index = this.brands_add.findIndex(
      (brand: any) => brand.id == this.brand_id
    );
    if (index != -1) {
      this.toastr.error('Validación', 'La marca ya está en la lista.');
      return;
    }

    const data = this.brands.find((brand: any) => brand.id == this.brand_id);

    if (data) {
      this.brands_add.push(data);
    }
  }

  removeProduct(product: any) {
    const index = this.products_add.findIndex(
      (item: any) => item.id == product.id
    );
    if (index != -1) {
      this.products_add.splice(index, 1);
    }
  }

  removeCategorie(categorie: any) {
    const index = this.categories_add.findIndex(
      (item: any) => item.id == categorie.id
    );
    if (index != -1) {
      this.categories_add.splice(index, 1);
    }
  }

  removeBrand(brand: any) {
    const index = this.brands_add.findIndex((item: any) => item.id == brand.id);
    if (index != -1) {
      this.brands_add.splice(index, 1);
    }
  }
}
