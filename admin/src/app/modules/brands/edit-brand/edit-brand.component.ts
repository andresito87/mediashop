import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss'],
})
export class EditBrandComponent {
  @Output() BrandEdit: EventEmitter<any> = new EventEmitter();
  @Input() brand: any;

  name: string = '';
  isLoading$: any;
  state: number = 1;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.brandService.isLoading$;
    this.name = this.brand.name;
    this.state = this.brand.state;
  }

  store() {
    if (!this.name) {
      this.toastr.error('Error', 'Todos los campos son necesarios');
      return;
    }

    let data = {
      name: this.name,
      state: this.state,
    };
    this.brandService
      .updateBrands(this.brand.id, data)
      .subscribe((res: any) => {
        console.log(res);

        if (res.message == 403) {
          this.toastr.error(
            'Validación',
            'El nombre de la marca ya existe en la base de datos'
          );
          return;
        } else {
          this.BrandEdit.emit(res.brand);
          this.toastr.success(
            'Éxito',
            'La marca se ha actualizado correctamente'
          );
          this.modal.close();
        }
      });
  }
}
