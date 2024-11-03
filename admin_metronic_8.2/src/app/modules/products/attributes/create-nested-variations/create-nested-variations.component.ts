import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';
import { EditNestedVariationsComponent } from '../edit-nested-variations/edit-nested-variations.component';
import { DeleteNestedVariationsComponent } from '../delete-nested-variations/delete-nested-variations.component';
import { DeleteVariationsSpecificationsComponent } from '../delete-variations-specifications/delete-variations-specifications.component';

@Component({
  selector: 'app-create-nested-variations',
  templateUrl: './create-nested-variations.component.html',
  styleUrls: ['./create-nested-variations.component.scss'],
})
export class CreateNestedVariationsComponent {
  @Input() variation: any;

  specification_attribute_id: string = '';
  type_attribute_specification: number = 1;
  variation_attribute_id: string = '';
  type_attribute_variation: number = 1;
  attributes: any = [];

  attributes_specifications: any = [];
  @Input() attributes_variations: any = [];
  properties: any = [];
  property_id: any = null;
  value_add: any = null;
  specifications: any = [];
  variations: any = [];

  add_price: number = 0;
  stock: number = 0;

  isLoading$: any;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;
    this.listNestedVariations();
  }

  listNestedVariations() {
    this.attributeService
      .listNestedVariations(this.variation.product_id, this.variation.id)
      .subscribe((res: any) => {
        this.variations = res.variations;
      });
  }

  changeVariations() {
    this.value_add = null;
    this.property_id = null;
    const ATTRIBUTE = this.attributes_variations.find(
      (item: any) => item.id == this.variation_attribute_id
    );
    if (ATTRIBUTE) {
      this.type_attribute_variation = ATTRIBUTE.type_variation;
      if (
        this.type_attribute_variation == 3 ||
        this.type_attribute_variation == 4
      ) {
        this.properties = ATTRIBUTE.properties;
      } else {
        this.properties = [];
      }
    } else {
      this.type_attribute_variation = 0;
      this.properties = [];
    }
  }

  getValueAttribute(attribute_special: any) {
    if (attribute_special.property_id) {
      return attribute_special.property.name;
    }
    if (attribute_special.value_add) {
      try {
        // Attempt to parse the value in case it is JSON
        const parsedValue = JSON.parse(attribute_special.value_add);

        // If `parsedValue` is an array, extract the names and join them into a string
        if (Array.isArray(parsedValue)) {
          return parsedValue.map((item: any) => item.name).join(', ');
        }

        // If it is not an array, return the original value
        return attribute_special.value_add;
      } catch (error) {
        // If it is not valid JSON, return the value directly
        return attribute_special.value_add;
      }
    }

    return '-----';
  }

  saveNestedVariation() {
    if (
      !this.variation_attribute_id ||
      (!this.property_id && !this.value_add)
    ) {
      this.toastr.error('Validacion', 'Ingrese los campos requeridos');
      return;
    }
    if (this.add_price < 0) {
      this.toastr.error(
        'Validacion',
        'El valor del precio no puede ser negativo'
      );
      return;
    }
    if (this.stock <= 0) {
      this.toastr.error('Validacion', 'El stock debe ser mayor a 0');
      return;
    }

    let data = {
      product_id: this.variation.product_id,
      attribute_id: this.variation_attribute_id,
      property_id: this.property_id,
      value_add: this.value_add,
      add_price: this.add_price,
      stock: this.stock,
      product_variation_id: this.variation.id,
    };

    this.attributeService.createNestedVariation(data).subscribe({
      next: (res: any) => {
        this.variations.unshift(res.variation);
        this.value_add = null;
        this.property_id = null;
        this.variation_attribute_id = '';
        this.add_price = 0;
        this.stock = 0;
        this.toastr.success(
          'Éxito',
          'Variación anidada guardada correctamente'
        );
        console.log(res);
      },
      error: (err) => {
        this.toastr.error('Error', err.error.message_text);
      },
    });
  }

  editNestedVariation(variation: any) {
    const modal = this.modalService.open(EditNestedVariationsComponent, {
      centered: true,
      size: 'md',
    });
    // in the parent component, specification will hold specification or variation as Input()
    modal.componentInstance.specification = variation;
    modal.componentInstance.attributes_variations = this.attributes_variations;
    modal.componentInstance.is_variation = true;

    modal.componentInstance.SpecificacionEdit.subscribe((edit: any) => {
      let INDEX = this.variations.findIndex(
        (item: any) => item.id == edit.variation.id
      );
      if (INDEX != -1) {
        this.variations[INDEX] = edit.variation;
      }
    });
  }

  deleteNestedVariation(variation: any) {
    const modal = this.modalService.open(
      DeleteVariationsSpecificationsComponent,
      {
        centered: true,
        size: 'md',
      }
    );
    modal.componentInstance.specification = variation;
    modal.componentInstance.is_variation = true;

    modal.componentInstance.SpecificationDelete.subscribe((edit: any) => {
      let INDEX = this.variations.findIndex(
        (item: any) => item.id == variation.id
      );
      if (INDEX != -1) {
        this.variations.splice(INDEX, 1);
      }
    });
  }
}
