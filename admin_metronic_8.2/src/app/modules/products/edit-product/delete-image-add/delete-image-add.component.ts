import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-image-add',
  templateUrl: './delete-image-add.component.html',
  styleUrls: ['./delete-image-add.component.scss'],
})
export class DeleteImageAddComponent {
  @Input() id: any;

  @Output() ImageDelete: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public productImageService: ProductService,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.productImageService.isLoading$;
  }

  delete() {
    this.productImageService
      .deleteImageProduct(this.id)
      .subscribe((res: any) => {
        this.ImageDelete.emit({ message: 200 });
        this.modal.close();
      });
  }
}
