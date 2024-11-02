import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-variations-specifications',
  templateUrl: './delete-variations-specifications.component.html',
  styleUrls: ['./delete-variations-specifications.component.scss'],
})
export class DeleteVariationsSpecificationsComponent {
  @Input() specification: any;

  @Output() SpecificationDelete: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.attributeService.isLoading$;
  }

  delete() {
    this.attributeService
      .deleteSpecification(this.specification.id)
      .subscribe((res: any) => {
        this.SpecificationDelete.emit({ message: 200 });
        this.modal.close();
      });
  }
}
