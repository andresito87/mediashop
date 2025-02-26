import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-variations-specifications',
  templateUrl: './edit-variations-specifications.component.html',
  styleUrls: ['./edit-variations-specifications.component.scss'],
})
export class EditVariationsSpecificationsComponent {
  @Output() SpecificacionEdit: EventEmitter<any> = new EventEmitter();

  @Input() specification: any;
  @Input() attributes_variations: any = [];
  @Input() is_variation: boolean; //False to edit specifications, True to edit variations

  isLoading$: any;

  specification_attribute_id: string = '';
  type_attribute_specification: number = 1;
  variation_attribute_id: string = '';
  type_attribute_variation: number = 1;
  attributes: any = [];

  dropdownList: any = [];
  selectedItemsSpecifications: any = []; // input_4 multiselectable
  dropdownSettings: IDropdownSettings = {};

  @Input() attributes_specifications: any = [];
  properties: any = [];
  property_id: any = null;
  value_add: any = null;
  specifications: any = [];

  add_price: any = 0;
  stock: any = 0;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    // choose if we are editing a specification or a variation
    if (!this.is_variation) {
      this.specification_attribute_id = this.specification.attribute_id;
      this.changeSpecifications();
    } else {
      this.variation_attribute_id = this.specification.attribute_id;
      this.changeVariations();
    }
    // Use setTimeouts to load data in specification edit form
    setTimeout(() => {
      let oldTypeAttribute = this.type_attribute_specification;
      this.property_id =
        this.specification_attribute_id || this.variation_attribute_id
          ? this.specification.property_id
          : null;

      if (this.specification.attribute.type_attribute == 4) {
        this.type_attribute_specification = 0;
        this.selectedItemsSpecifications = this.specification.value_add
          ? JSON.parse(this.specification.value_add)
          : [];
        setTimeout(() => {
          this.type_attribute_specification = oldTypeAttribute;
          this.isLoadingView();
        }, 25);
      } else {
        this.value_add = this.specification.value_add
          ? this.specification.value_add
          : null;
      }
    }, 25);
    if (this.is_variation) {
      this.add_price = this.specification.add_price;
      this.stock = this.specification.stock;
    }
  }

  store() {
    if (!this.is_variation) {
      this.storeSpecification();
    } else {
      this.storeVariation();
    }
  }

  storeSpecification() {
    if (
      this.type_attribute_specification == 4 &&
      this.selectedItemsSpecifications.length == 0
    ) {
      this.toastr.error('Validacion', 'Necesitas seleccionar algunos items');
      return;
    }

    if (this.selectedItemsSpecifications.length > 0) {
      this.value_add = JSON.stringify(this.selectedItemsSpecifications);
    }

    if (
      !this.specification_attribute_id ||
      (!this.property_id && !this.value_add)
    ) {
      this.toastr.error('Validacion', 'Ingrese los campos requeridos');
      return;
    }

    let data = {
      product_id: this.specification.product_id,
      attribute_id: this.specification_attribute_id,
      property_id: this.property_id,
      value_add: this.value_add,
    };
    this.attributeService
      .updateSpecification(this.specification.id, data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(
            'Éxito',
            'Especificación actualizada correctamente'
          );
          this.SpecificacionEdit.emit(res);
          this.modal.close();
        },
        error: (err) => {
          this.toastr.error('Error', err.error.message_text);
        },
      });
  }

  storeVariation() {
    if (
      !this.variation_attribute_id ||
      (!this.property_id && !this.value_add)
    ) {
      this.toastr.error('Validacion', 'Ingrese los campos requeridos');
      return;
    }

    let data = {
      product_id: this.specification.product_id,
      attribute_id: this.variation_attribute_id,
      property_id: this.property_id,
      value_add: this.value_add,
      add_price: this.add_price,
      stock: this.stock,
    };
    this.attributeService
      .updateVariation(this.specification.id, data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Éxito', 'Variación actualizada correctamente');
          this.SpecificacionEdit.emit(res);
          this.modal.close();
        },
        error: (err) => {
          this.toastr.error('Error', err.error.message_text);
        },
      });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  isLoadingView() {
    this.attributeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributeService.isLoadingSubject.next(false);
    }, 50);
  }

  changeSpecifications() {
    this.value_add = null;
    this.property_id = null;
    this.selectedItemsSpecifications = [];
    const ATTRIBUTE = this.attributes_specifications.find(
      (item: any) => item.id == this.specification_attribute_id
    );
    if (ATTRIBUTE) {
      this.type_attribute_specification = ATTRIBUTE.type_specification;
      if (
        this.type_attribute_specification == 3 ||
        this.type_attribute_specification == 4
      ) {
        this.properties = ATTRIBUTE.properties;
        this.dropdownList = ATTRIBUTE.properties;
      } else {
        this.properties = [];
        this.dropdownList = [];
      }
    } else {
      this.type_attribute_specification = 0;
      this.properties = [];
      this.dropdownList = [];
    }
  }

  changeVariations() {
    this.value_add = null;
    this.property_id = null;
    const ATTRIBUTE = this.attributes_variations.find(
      (item: any) => item.id == this.variation_attribute_id
    );
    if (ATTRIBUTE) {
      this.type_attribute_specification = ATTRIBUTE.type_variation;
      if (
        this.type_attribute_specification == 3 ||
        this.type_attribute_specification == 4
      ) {
        this.properties = ATTRIBUTE.properties;
      } else {
        this.properties = [];
      }
    } else {
      this.type_attribute_specification = 0;
      this.properties = [];
    }
  }
}
