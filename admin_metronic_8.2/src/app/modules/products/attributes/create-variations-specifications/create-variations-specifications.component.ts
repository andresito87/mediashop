import { Component } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { EditVariationsSpecificationsComponent } from '../edit-variations-specifications/edit-variations-specifications.component';
import { DeleteVariationsSpecificationsComponent } from '../delete-variations-specifications/delete-variations-specifications.component';

@Component({
  selector: 'app-create-variations-specifications',
  templateUrl: './create-variations-specifications.component.html',
  styleUrls: ['./create-variations-specifications.component.scss'],
})
export class CreateVariationsSpecificationsComponent {
  title: string = '';
  sku: string = '';

  isLoading$: any;

  specification_attribute_id: string = '';
  type_attribute_specification: number = 1;
  variation_attribute_id: string = '';
  type_attribute_variation: number = 1;
  attributes: any = [];

  dropdownList: any = [];
  selectedItemsSpecifications: any = []; // input_4 multiselectable
  dropdownSettings: IDropdownSettings = {};
  word: string = '';

  isShowMultiselect: Boolean = false;

  PRODUCT_ID: string = '';
  PRODUCT_SELECTED: any;

  input_1: string = '';
  input_2: number = 0;
  input_3: any; // selectable

  input_1_variation: any; // selectable
  dropdownListVariations: any = [];
  selectedItemsVariations: any = []; // input_2 multiselectable
  add_price: number = 0;
  stock: number = 0;

  attributes_specifications: any = [];
  attributes_variations: any = [];
  properties: any = [];
  property_id: any = null;
  value_add: any = null;
  specifications: any = [];
  variations: any = [];

  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    private activedRoute: ActivatedRoute,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;

    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' },
    // ];
    // this.tags = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.activedRoute.params.subscribe((res: any) => {
      this.PRODUCT_ID = res.id;
    });

    this.showProduct();
    this.configAll();
    this.listSpecifications();
    this.listVariations();
  }

  configAll() {
    this.attributeService.configAll().subscribe((res: any) => {
      this.attributes_specifications = res.attributes_specifications;
      this.attributes_variations = res.attributes_variations;
    });
  }

  listSpecifications() {
    this.attributeService
      .listSpecifications(this.PRODUCT_ID)
      .subscribe((res: any) => {
        this.specifications = res.specifications;
      });
  }

  listVariations() {
    this.attributeService
      .listVariations(this.PRODUCT_ID)
      .subscribe((res: any) => {
        this.variations = res.variations;
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

  showProduct() {
    this.attributeService.showProduct(this.PRODUCT_ID).subscribe((res: any) => {
      this.PRODUCT_SELECTED = res.product;
      this.title = res.product.title;
      this.sku = res.product.sku;
    });
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

  addItems() {
    this.isShowMultiselect = true;
    let dateTime = new Date().getTime();
    if (this.word != '') {
      this.dropdownList.push({
        item_id: dateTime,
        item_text: this.word,
      });
      // this.tags.push({
      //   item_id: dateTime,
      //   item_text: this.word,
      // });
    }
    setTimeout(() => {
      this.isShowMultiselect = false;
      this.isLoadingView();
      // clear the input
      this.word = '';
    }, 100);
  }

  saveSpecification() {
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
      product_id: this.PRODUCT_ID,
      attribute_id: this.specification_attribute_id,
      property_id: this.property_id,
      value_add: this.value_add,
    };

    this.attributeService.createSpecification(data).subscribe({
      next: (res: any) => {
        this.specifications.unshift(res.specification);
        this.value_add = null;
        this.property_id = null;
        this.specification_attribute_id = '';
        this.toastr.success('Éxito', 'Especificación guardada correctamente');
      },
      error: (err) => {
        this.toastr.error('Error', err.error.message_text);
      },
    });
  }

  editSpecification(specification: any) {
    const modal = this.modalService.open(
      EditVariationsSpecificationsComponent,
      { centered: true, size: 'md' }
    );
    modal.componentInstance.specification = specification;

    modal.componentInstance.attributes_specifications =
      this.attributes_specifications;

    modal.componentInstance.SpecificacionEdit.subscribe((edit: any) => {
      let INDEX = this.specifications.findIndex(
        (item: any) => item.id == edit.specification.id
      );
      if (INDEX != -1) {
        this.specifications[INDEX] = edit.specification;
      }
    });
  }

  deleteSpecification(specification: any) {
    const modal = this.modalService.open(
      DeleteVariationsSpecificationsComponent,
      { centered: true, size: 'md' }
    );
    modal.componentInstance.specification = specification;

    modal.componentInstance.SpecificationDelete.subscribe((edit: any) => {
      let INDEX = this.specifications.findIndex(
        (item: any) => item.id == specification.id
      );
      if (INDEX != -1) {
        this.specifications.splice(INDEX, 1);
      }
    });
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

  saveVariation() {
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
      product_id: this.PRODUCT_ID,
      attribute_id: this.variation_attribute_id,
      property_id: this.property_id,
      value_add: this.value_add,
      add_price: this.add_price,
      stock: this.stock,
    };

    this.attributeService.createVariation(data).subscribe({
      next: (res: any) => {
        this.variations.unshift(res.variation);
        this.value_add = null;
        this.property_id = null;
        this.variation_attribute_id = '';
        this.add_price = 0;
        this.stock = 0;
        this.toastr.success('Éxito', 'Variación guardada correctamente');
        console.log(res);
      },
      error: (err) => {
        this.toastr.error('Error', err.error.message_text);
      },
    });
  }

  editVariation(variation: any) {
    const modal = this.modalService.open(
      EditVariationsSpecificationsComponent,
      { centered: true, size: 'md' }
    );
    // in the parent component, specification will hold specification or variation as Input()
    modal.componentInstance.specification = variation;

    modal.componentInstance.attributes_specifications =
      this.attributes_specifications;
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

  deleteVariation(variation: any) {
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
