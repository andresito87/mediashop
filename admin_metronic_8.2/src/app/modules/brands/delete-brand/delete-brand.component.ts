import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrandService } from '../service/brand.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.scss'],
})
export class DeleteBrandComponent {
  @Input() brand: any;

  @Output() BrandDelete: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public brandService: BrandService,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.brandService.isLoading$;
  }

  delete() {
    this.brandService.deleteBrands(this.brand.id).subscribe((res: any) => {
      this.BrandDelete.emit({ message: 200 });
      this.modal.close();
    });
  }
}
