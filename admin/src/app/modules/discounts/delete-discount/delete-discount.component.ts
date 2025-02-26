import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiscountsService } from '../service/discounts.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-discount',
  templateUrl: './delete-discount.component.html',
  styleUrls: ['./delete-discount.component.scss'],
})
export class DeleteDiscountComponent {
  @Input() discount: any;

  @Output() DiscountDelete: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public discountService: DiscountsService,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.discountService.isLoading$;
  }

  delete() {
    this.discountService.deleteDiscount(this.discount.id).subscribe({
      next: (res: any) => {
        console.log(res.status, res);
        if (res.status !== 200) {
          this.toastr.error(
            'Error',
            res.body?.message || 'Ha ocurrido un error'
          );
        } else {
          this.DiscountDelete.emit({ message: 200 });
          this.modal.close();
        }
      },
      error: (err) => {
        this.toastr.error('Error', err.message || 'Ha ocurrido un error');
      },
    });
  }
}
