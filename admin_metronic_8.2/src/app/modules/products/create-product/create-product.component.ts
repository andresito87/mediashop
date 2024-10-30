import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  title: string = '';
  sku: string = '';
  resume: string = '';
  price_eur: number = 0;
  price_usd: number = 0;
  description: any = '<p>Hello World!</p>';
  // desactivate security warnings
  editorConfig = {
    versionCheck: false,
  };
  image_preview: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;
  brand_id: any = '';
  brands: any = [];

  isLoading$: any;

  categorie_first_id: string = '';
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  categories_first: any = [];
  categories_second: any = [];
  categories_second_filtered: any = [];
  categories_third: any = [];
  categories_third_filtered: any = [];

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};

  isShowMultiselect: Boolean = false;

  constructor(
    public productService: ProductService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' },
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toastr.error('Validacion', 'El archivo no es una imagen');
      return;
    }

    this.file_image = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_image);
    reader.onloadend = () => (this.image_preview = reader.result);
    this.isLoadingView();
  }

  isLoadingView() {
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  changeDepartment() {
    this.categories_second_filtered = this.categories_second.filter(
      (item: any) => item.categorie_second_id == this.categorie_first_id
    );
  }

  changeCategorie() {
    this.categories_third_filtered = this.categories_third.filter(
      (item: any) => item.categorie_second_id == this.categorie_second_id
    );
  }

  // TODO: it needs refactoring
  addItems() {
    this.isShowMultiselect = true;
    this.dropdownList.push({
      item_id: 6,
      item_text: 'Nueva Marca',
    });
    this.selectedItems.push({
      item_id: 6,
      item_text: 'Nueva Marca',
    });
    setTimeout(() => {
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100);
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  save() {
    if (!this.title || !this.file_image) {
      this.toastr.error('Validacion', 'Los campos con el * son obligatorios');
      return;
    }
    let formData = new FormData();
    formData.append('title', this.title);
    formData.append('imagen', this.file_image);

    this.productService.createProducts(formData).subscribe((res: any) => {
      // clean form
      this.title = '';
      this.file_image = null;
      this.image_preview =
        'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
      this.toastr.success('Exito', 'El producto se registró correctamente');
    });
  }
}
