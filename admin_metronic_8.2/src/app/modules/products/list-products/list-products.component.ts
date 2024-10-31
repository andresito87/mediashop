import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from './../service/product.service';
import { Component } from '@angular/core';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent {
  products: any = [];
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
    public productService: ProductService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listProducts();
    this.isLoading$ = this.productService.isLoading$;
    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((res: any) => {
      this.brands = res.brands;
      this.categories_first = res.categories_first;
      this.categories_second = res.categories_second;
      this.categories_third = res.categories_third;
    });
  }

  listProducts(page: number = 1) {
    let data = {
      search: this.search,
      brand_id: this.brand_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
    };
    this.productService.listProducts(page, data).subscribe({
      next: (res: any) => {
        this.products = res.products.data;
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
    this.listProducts();
  }

  loadPage($event: any) {
    this.listProducts($event);
  }

  deleteProduct(product: any) {
    const modalRef = this.modalService.open(DeleteProductComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.product = product;

    modalRef.componentInstance.ProductDelete.subscribe((res: any) => {
      let INDEX = this.products.findIndex(
        (item: any) => item.id === product.id
      );
      if (INDEX != -1) {
        this.products.splice(INDEX, 1);
      }
    });
  }
}
