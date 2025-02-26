import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DiscountsService } from '../service/discounts.service';
import { ActivatedRoute } from '@angular/router';
import { URL_TIENDA } from 'src/app/config/config';

@Component({
  selector: 'app-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.scss'],
})
export class EditDiscountComponent {
  type_discount: number = 1; // 1 is %, 2 is fixed amount
  discount: number = 0;
  type_campaign: number = 1; // 1 normal, 2 flash, 3 link
  target_discount: number = 1;
  product_id: any;
  categorie_id: any;
  brand_id: any;
  start_date: any;
  end_date: any;
  state: number = 1;

  isLoading$: any;

  products: any = [];
  categories_first: any = [];
  brands: any = [];
  products_add: any = [];
  categories_add: any = [];
  brands_add: any = [];

  DISCOUNT_ID: any;
  DISCOUNT_SELECTED: any;
  constructor(
    public discountsService: DiscountsService,
    private toastr: ToastrService,
    private activedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.isLoading$ = this.discountsService.isLoading$;
    this.activedRoute.params.subscribe((res: any) => {
      this.DISCOUNT_ID = res.id;
    });

    this.discountsService
      .showDiscount(this.DISCOUNT_ID)
      .subscribe((res: any) => {
        this.DISCOUNT_SELECTED = res.discount;

        this.type_discount = res.discount.type_discount;
        this.discount = res.discount.discount;
        this.target_discount = res.discount.target_discount;
        this.products_add = res.discount.products;
        this.categories_add = res.discount.categories;
        this.brands_add = res.discount.brands;
        this.start_date = res.discount.start_date;
        this.end_date = res.discount.end_date;
        this.type_campaign = res.discount.type_campaign;
        this.state = res.discount.state;
      });

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
    this.target_discount = value;
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = null;
    this.categorie_id = null;
    this.brand_id = null;
  }

  update() {
    if (!this.discount || !this.start_date || !this.end_date) {
      this.toastr.error('Validación', 'Ingrese todos los campos');
      return;
    }

    if (this.target_discount == 1 && this.products_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos un producto'
      );
    }

    if (this.target_discount == 2 && this.categories_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una categoría'
      );
    }

    if (this.target_discount == 3 && this.brands_add.length == 0) {
      this.toastr.error(
        'Validacion',
        'Es necesario seleccionar al menos una marca'
      );
    }

    let data = {
      type_discount: this.type_discount,
      discount: this.discount,
      target_discount: this.target_discount,
      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
      start_date: this.start_date,
      end_date: this.end_date,
      type_campaign: this.type_campaign,
      state: this.state,
    };

    this.discountsService.updateDiscounts(this.DISCOUNT_ID, data).subscribe({
      next: (res: any) => {
        this.toastr.success(
          'Éxito',
          'Campaña de descuento actualizada correctamente'
        );
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

  copyLink(product: any) {
    navigator.clipboard
      .writeText(
        URL_TIENDA +
          '/product/' +
          product.slug +
          '?discount=' +
          this.DISCOUNT_SELECTED.code
      )
      .then(() => {
        this.toastr.info('Info', 'Link copiado al portapapeles');
      })
      .catch((err) => {
        this.toastr.error('Error', 'Error al copiar el link al portapapeles');
      });
  }
}
