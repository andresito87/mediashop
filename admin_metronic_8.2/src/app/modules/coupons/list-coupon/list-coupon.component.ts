import { Component } from '@angular/core';
import { CouponsService } from '../service/coupons.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCouponComponent } from '../delete-coupon/delete-coupon.component';

@Component({
  selector: 'app-list-coupon',
  templateUrl: './list-coupon.component.html',
  styleUrls: ['./list-coupon.component.scss'],
})
export class ListCouponComponent {
  coupons: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public couponsService: CouponsService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listCoupons();
    this.isLoading$ = this.couponsService.isLoading$;
  }

  listCoupons(page: number = 1) {
    this.couponsService.listCoupons(page, this.search).subscribe((res: any) => {
      this.coupons = res.coupons.data;
      this.totalPages = res.total;
      this.currentPage = page;
    });
  }

  searchTo() {
    this.listCoupons();
  }

  loadPage($event: any) {
    this.listCoupons($event);
  }

  getNameTypeCoupon(type_coupon: number) {
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

  deleteCoupon(coupon: any) {
    const modalRef = this.modalService.open(DeleteCouponComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.coupon = coupon;

    modalRef.componentInstance.CouponDelete.subscribe((res: any) => {
      let INDEX = this.coupons.findIndex((item: any) => item.id === coupon.id);
      if (INDEX != -1) {
        this.coupons.splice(INDEX, 1);
      }
    });
  }
}
