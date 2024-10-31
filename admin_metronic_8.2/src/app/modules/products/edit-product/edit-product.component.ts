import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteImageAddComponent } from './delete-image-add/delete-image-add.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent {
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
  tags: any = [];
  dropdownSettings: IDropdownSettings = {};
  word: string = '';

  isShowMultiselect: Boolean = false;

  // index signature property, allows dinamicly properties access
  [key: string]: any;

  PRODUCT_ID: string = '';
  PRODUCT_SELECTED: any;

  image_add: any;
  image_add_preview: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  images_files: any = [];

  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    private activedRoute: ActivatedRoute,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;

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

    this.configAll();
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

  processFileImages($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toastr.error('Validacion', 'El archivo no es una imagen');
      return;
    }

    this.image_add = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.image_add);
    reader.onloadend = () => (this.image_add_preview = reader.result);
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

  configAll() {
    this.productService.configAll().subscribe((res: any) => {
      this.brands = res.brands;
      this.categories_first = res.categories_first;
      this.categories_second = res.categories_second;
      this.categories_third = res.categories_third;
      this.showProduct();
    });
  }

  showProduct() {
    this.productService.showProduct(this.PRODUCT_ID).subscribe((res: any) => {
      this.PRODUCT_SELECTED = res.product;
      this.title = res.product.title;
      this.sku = res.product.sku;
      this.resume = res.product.resume;
      this.price_eur = res.product.price_eur;
      this.price_usd = res.product.price_usd;
      this.description = res.product.description;
      this.image_preview = res.product.image;
      this.brand_id = res.product.brand_id;
      this.categorie_first_id = res.product.categorie_first_id;
      this.categorie_second_id = res.product.categorie_second_id;
      this.categorie_third_id = res.product.categorie_third_id;
      this.images_files = res.product.images;

      this.changeDepartment();
      this.changeCategorie();
      this.dropdownList = res.product.tags;
      this.tags = res.product.tags;
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

  removeImages(id: number) {
    const modalRef = this.modalService.open(DeleteImageAddComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.id = id;

    modalRef.componentInstance.ImageDelete.subscribe(() => {
      const index = this.images_files.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        this.images_files.splice(index, 1);
        this.toastr.success('Éxito', 'Imagen eliminada correctamente');
      } else {
        this.toastr.error('Error', 'No se pudo encontrar la imagen');
      }
    });
  }

  addImage() {
    if (!this.image_add) {
      this.toastr.error('Validacion', 'Es requerido subir una imagen');
      return;
    }

    let formData = new FormData();
    formData.append('image_add', this.image_add);
    formData.append('product_id', this.PRODUCT_ID);
    this.productService.imageAdd(formData).subscribe({
      next: (res: any) => {
        this.images_files.unshift(res.image);
        this.image_add = null;
        this.image_add_preview =
          'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';

        this.toastr.success('Exito', 'Imagenes guardadas correctamente');
      },
      error: (error) => {
        console.error('Error al subir la imagen:', error);
        this.errorMessage = 'No se pudo subir la imagen. Inténtalo de nuevo.';
        this.toastr.error(
          'Error',
          'No se pudo subir la imagen. Inténtalo de nuevo.'
        );
      },
    });
  }

  onChange(event: any) {
    this.description = event.editor.getData();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  clearIfZero(field: any) {
    if (this[field] === 0) {
      this[field] = '';
    }
  }

  save() {
    if (
      !this.title ||
      !this.sku ||
      !this.price_eur ||
      !this.price_usd ||
      !this.brand_id ||
      !this.categorie_first_id ||
      !this.description ||
      !this.resume ||
      this.tags == 0
    ) {
      this.toastr.error('Validacion', 'Los campos con el * son obligatorios');
      return;
    }
    let formData = new FormData();
    formData.append('title', this.title);
    formData.append('sku', this.sku);
    formData.append('price_eur', this.price_eur + '');
    formData.append('price_usd', this.price_usd + '');
    formData.append('brand_id', this.brand_id);
    if (this.file_image) {
      formData.append('cover_image', this.file_image);
    }

    formData.append('categorie_first_id', this.categorie_first_id);
    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }
    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }

    formData.append('description', this.description);
    formData.append('resume', this.resume);
    formData.append('multiselect', JSON.stringify(this.tags));

    this.productService.updateProducts(this.PRODUCT_ID, formData).subscribe({
      next: (res: any) => {
        if (res.message === 403) {
          this.toastr.error('Validación', res.message_text);
        } else {
          // clean form
          // this.title = '';
          this.file_image = null;
          // this.sku = '';
          // this.price_eur = 0;
          // this.price_usd = 0;
          // this.brand_id = '';
          // this.categorie_first_id = '';
          // this.categorie_second_id = '';
          // this.categorie_third_id = '';
          // this.description = '';
          // this.resume = '';
          // this.dropdownList = [];
          // this.tags = [];
          // this.image_preview =
          //   'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
          this.toastr.success(
            'Éxito',
            'El producto se actualizó correctamente'
          );
        }
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error(
          'API RESPONSE - COMUNIQUESE CON EL DESARROLLADOR',
          err.error.message || 'Ha ocurrido un error'
        );
      },
    });
  }
}
