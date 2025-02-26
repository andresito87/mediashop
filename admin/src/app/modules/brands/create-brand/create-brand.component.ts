import { Component, EventEmitter, Output } from '@angular/core';
import { BrandService } from '../service/brand.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss'],
})
export class CreateBrandComponent {
  @Output() BrandCreate: EventEmitter<any> = new EventEmitter();

  name: string = '';
  isLoading$: any;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.brandService.isLoading$;
  }

  store() {
    if (!this.name) {
      this.toastr.error('Error', 'Todos los campos son necesarios');
      return;
    }

    let data = {
      name: this.name,
      state: 1,
    };
    this.brandService.createBrands(data).subscribe((res: any) => {
      console.log(res);

      if (res.message == 403) {
        this.toastr.error(
          'Validación',
          'El nombre de la marca ya existe en la base de datos'
        );
        return;
      } else {
        this.BrandCreate.emit(res.brand);
        this.toastr.success('Éxito', 'La marca se ha guardado correctamente');
        this.modal.close();
      }
    });
  }
}
