import { Component } from '@angular/core';
import { DiscountsService } from '../service/discounts.service';
import { DeleteDiscountComponent } from '../delete-discount/delete-discount.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_TIENDA } from 'src/app/config/config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-discount',
  templateUrl: './list-discount.component.html',
  styleUrls: ['./list-discount.component.scss'],
})
export class ListDiscountComponent {
  discounts: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public discountService: DiscountsService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listDiscounts();
    this.isLoading$ = this.discountService.isLoading$;
  }

  listDiscounts(page: number = 1) {
    this.discountService
      .listDiscounts(page, this.search)
      .subscribe((res: any) => {
        this.discounts = res.discounts.data;
        this.totalPages = res.total;
        this.currentPage = page;
      });
  }

  searchTo() {
    this.listDiscounts();
  }

  loadPage($event: any) {
    this.listDiscounts($event);
  }

  getNameTypeDiscount(type_coupon: number) {
    let name = '';
    switch (type_coupon) {
      case 1:
        name = 'Productos';
        break;
      case 2:
        name = 'Categorías';
        break;
      case 3:
        name = 'Marcas';
        break;
      default:
        break;
    }
    return name;
  }

  getNameTypeCampaign(type_campaign: any) {
    let name = '';
    switch (type_campaign) {
      case 1:
        name = 'Normal';
        break;
      case 2:
        name = 'Flash';
        break;
      case 3:
        name = 'Link';
        break;
      default:
        break;
    }
    return name;
  }

  deleteDiscount(discount: any) {
    const modalRef = this.modalService.open(DeleteDiscountComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.discount = discount;

    modalRef.componentInstance.DiscountDelete.subscribe((res: any) => {
      let INDEX = this.discounts.findIndex(
        (item: any) => item.id === discount.id
      );
      if (INDEX != -1) {
        this.discounts.splice(INDEX, 1);
      }
    });
  }

  copyLink(discount: any) {
    navigator.clipboard
      .writeText(URL_TIENDA + '/discount/' + discount.code)
      .then(() => {
        this.toastr.info('Info', 'Link copiado al portapapeles');
      })
      .catch((err) => {
        this.toastr.error('Error', 'Error al copiar el link al portapapeles');
      });
  }
}
