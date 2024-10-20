import { Component, EventEmitter, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-attribute',
  templateUrl: './create-attribute.component.html',
  styleUrls: ['./create-attribute.component.scss'],
})
export class CreateAttributeComponent {
  @Output() AttributeCreate: EventEmitter<any> = new EventEmitter();

  name: string = '';
  type_attribute: number = 1;
  isLoading$: any;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;
  }

  store() {
    if (!this.name || !this.type_attribute) {
      this.toastr.error('Error', 'Todos los campos son necesarios');
      return;
    }

    let data = {
      name: this.name,
      type_attribute: this.type_attribute,
      state: 1,
    };
    this.attributeService.createAttributes(data).subscribe((res: any) => {
      console.log(res);

      if (res.message == 403) {
        this.toastr.error(
          'Validación',
          'El nombre del atributo ya existe en la base de datos'
        );
        return;
      } else {
        this.AttributeCreate.emit(res.attribute);
        this.toastr.success(
          'Éxito',
          'El atributo se ha guardado correctamente'
        );
        this.modal.close();
      }
    });
  }
}
