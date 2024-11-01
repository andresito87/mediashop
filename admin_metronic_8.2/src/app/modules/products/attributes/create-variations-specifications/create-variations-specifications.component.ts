import { Component } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';

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
  precio_add: number = 0;
  stock_add: number = 0;

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
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.activedRoute.params.subscribe((res: any) => {
      this.PRODUCT_ID = res.id;
    });

    this.showProduct();
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

  save() {}
}
