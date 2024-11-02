import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';

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
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;
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

  saveVariation() {}

  store() {}

  editVariation(variation: any) {}
  deleteVariation(variation: any) {}
}
