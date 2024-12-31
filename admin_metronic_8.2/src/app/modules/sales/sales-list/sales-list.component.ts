import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../service/sales.service';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
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
}
