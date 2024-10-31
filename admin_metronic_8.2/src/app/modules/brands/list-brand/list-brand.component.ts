import { Component } from '@angular/core';
import { BrandService } from '../service/brand.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBrandComponent } from '../create-brand/create-brand.component';
import { EditBrandComponent } from '../edit-brand/edit-brand.component';
import { DeleteBrandComponent } from '../delete-brand/delete-brand.component';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.scss'],
})
export class ListBrandComponent {
  brands: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public brandService: BrandService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listBrands();
    this.isLoading$ = this.brandService.isLoading$;
  }

  listBrands(page: number = 1) {
    this.brandService.listBrands(page, this.search).subscribe((res: any) => {
      this.brands = res.brands;
      this.totalPages = res.total;
      this.currentPage = page;
    });
  }

  searchTo() {
    this.listBrands();
  }

  loadPage($event: any) {
    this.listBrands($event);
  }

  openModalCreateBrand() {
    const modalRef = this.modalService.open(CreateBrandComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.AttributeC.subscribe((attribute: any) => {
      this.brands.unshift(attribute);
    });
  }

  openModalEditBrand(attribute: any) {
    const modalRef = this.modalService.open(EditBrandComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.attribute = attribute;

    modalRef.componentInstance.AttributeEdit.subscribe((attribute: any) => {
      //this.brands.unshift(attribute);

      // get position of attribute which we are going to modify
      let INDEX = this.brands.findIndex((item: any) => item.id == attribute.id);
      if (INDEX != -1) {
        this.brands[INDEX] = attribute;
      }
    });
  }

  deleteBrand(attribute: any) {
    const modalRef = this.modalService.open(DeleteBrandComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.attribute = attribute;

    modalRef.componentInstance.AttributeDelete.subscribe((res: any) => {
      let INDEX = this.brands.findIndex((item: any) => item.id == attribute.id);
      if (INDEX != -1) {
        this.brands.splice(INDEX, 1);
      }
    });
  }
}
