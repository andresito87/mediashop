import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CouponsService } from '../service/coupons.service';

@Component({
  selector: 'app-delete-coupon',
  templateUrl: './delete-coupon.component.html',
  styleUrls: ['./delete-coupon.component.scss'],
})
export class DeleteCouponComponent {
  @Input() coupon: any;

  @Output() CouponDelete: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public couponService: CouponsService,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.couponService.isLoading$;
  }

  delete() {
    this.couponService.deleteCoupon(this.coupon.id).subscribe((res: any) => {
      if (res.status != 200) {
        this.toastr.error('Error', res.message);
      } else {
        this.CouponDelete.emit({ message: 200 });
        this.modal.close();
      }
    });
  }
}
