import { Component, LOCALE_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../service/sales.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { URL_SERVICIOS } from 'src/app/config/config';

registerLocaleData(localeEs);

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  styleUrls: ['./sales-list.component.scss'],
})
export class SalesListComponent {
  sales: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  brands: any = [];
  brand_id: any = '';
  categorie_first_id: string = '';
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  categories_first: any = [];
  categories_second: any = [];
  categories_second_filtered: any = [];
  categories_third: any = [];
  categories_third_filtered: any = [];

  start_date: any;
  end_date: any;
  method_payment: any;

  constructor(
    public salesService: SalesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listSales();
    this.isLoading$ = this.salesService.isLoading$;
    this.configAll();
  }

  configAll() {
    this.salesService.configAll().subscribe((res: any) => {
      this.brands = res.brands;
      this.categories_first = res.categories_first;
      this.categories_second = res.categories_second;
      this.categories_third = res.categories_third;
    });
  }

  listSales(page: number = 1) {
    let data = {
      search: this.search,
      brand_id: this.brand_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
      start_date: this.start_date,
      end_date: this.end_date,
      method_payment: this.method_payment,
    };
    this.salesService.listSales(page, data).subscribe({
      next: (res: any) => {
        this.sales = res.sales.data;
        this.totalPages = res.total;
        this.currentPage = page;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(
          'API RESPONSE - COMUNIQUESE CON EL DESARROLLADOR',
          err.error.message
        );
      },
    });
  }

  reset() {
    this.search = '';
    this.brand_id = '';
    this.categorie_first_id = '';
    this.categorie_second_id = '';
    this.categorie_third_id = '';
    this.start_date = null;
    this.end_date = null;
    this.method_payment = '';
    this.listSales();
  }

  changeDepartment() {
    this.categories_second_filtered = this.categories_second.filter(
      (item: any) => item.categorie_second_id == this.categorie_first_id
    );
  }

  changeCategorie() {
    this.categories_third_filtered = this.categories_third.filter(
      (item: any) => item.categorie_second_id == this.categorie_second_id
    );
  }

  searchTo() {
    this.listSales();
  }

  loadPage($event: any) {
    this.listSales($event);
  }

  export_sale_download() {
    let params = '';
    if (this.search) {
      params += '&search=' + this.search;
    }
    if (this.brand_id) {
      params += '&brand_id=' + this.brand_id;
    }
    if (this.categorie_first_id) {
      params += '&categorie_first_id=' + this.categorie_first_id;
    }
    if (this.categorie_second_id) {
      params += '&categorie_second_id=' + this.categorie_second_id;
    }
    if (this.categorie_third_id) {
      params += '&categorie_third_id=' + this.categorie_third_id;
    }
    if (this.start_date) {
      params += '&start_date=' + this.start_date;
    }
    if (this.end_date) {
      params += '&end_date=' + this.end_date;
    }
    if (this.method_payment) {
      params += '&method_payment=' + this.method_payment;
    }
    window.open(URL_SERVICIOS + '/sales/list-excel?k=1' + params, '_blank');
  }
}
