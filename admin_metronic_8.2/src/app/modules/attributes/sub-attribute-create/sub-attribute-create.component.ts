import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';
import { SubAttributeDeleteComponent } from '../sub-attribute-delete/sub-attribute-delete.component';

@Component({
  selector: 'app-sub-attribute-create',
  templateUrl: './sub-attribute-create.component.html',
  styleUrls: ['./sub-attribute-create.component.scss'],
})
export class SubAttributeCreateComponent {
  //@Output() AttributeCreate: EventEmitter<any> = new EventEmitter();
  @Input() attribute: any;
  properties: any = [];

  isLoading$: any;

  color: any;
  type_action: string = '1';
  name: string = '';

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;
    this.properties = this.attribute.properties;
  }

  store() {
    if (!this.name) {
      this.toastr.error('Error', 'Todos los campos son necesarios');
      return;
    }
    if (this.type_action == '2' && !this.color) {
      this.toastr.error('Error', 'Necesitas seleccionar un color');
      return;
    }

    let data = {
      name: this.name,
      code: this.color,
      attribute_id: this.attribute.id,
      state: 1,
    };
    this.attributeService.createProperties(data).subscribe((res: any) => {
      console.log(res);

      if (res.message == 403) {
        this.toastr.error(
          'Validación',
          'El nombre de la propiedad ya existe en la base de datos'
        );
        return;
      } else {
        this.properties.unshift(res.property);
        //this.AttributeCreate.emit(res.attribute);
        this.toastr.success(
          'Éxito',
          'La propiedad se ha guardado correctamente'
        );
        //this.modal.close();
      }
    });
  }

  delete(property: any) {
    const modalRef = this.modalService.open(SubAttributeDeleteComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.property = property;

    modalRef.componentInstance.PropertyDelete.subscribe((res: any) => {
      let INDEX = this.properties.findIndex(
        (item: any) => item.id == property.id
      );
      if (INDEX != -1) {
        this.properties.splice(INDEX, 1);
      }
    });
  }
}
