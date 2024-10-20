import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../service/categories.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.scss'],
})
export class EditCategorieComponent {
  type_categorie: number = 1;

  name: string = '';
  icon: string = '';
  position: number = 1;
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  state: string = '1';

  image_preview: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;

  isLoading$: any;

  categories_first: any = [];
  categories_second: any = [];
  categories_second_filtered: any = [];

  CATEGORIE_ID: string = '';
  CATEGORIE: any = null;

  constructor(
    public categorieService: CategoriesService,
    public toastr: ToastrService,
    public activedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();

    this.activedRoute.params.subscribe((res: any) => {
      this.CATEGORIE_ID = res.id;
    });

    this.categorieService
      .showCategorie(this.CATEGORIE_ID)
      .subscribe((res: any) => {
        this.CATEGORIE = res.categorie;
        this.type_categorie = res.categorie.type_categorie;
        this.name = res.categorie.name;
        this.icon = res.categorie.icon;
        this.position = res.categorie.position;
        this.categorie_second_id = res.categorie.categorie_second_id;
        this.categorie_third_id = res.categorie.categorie_third_id;
        this.image_preview = res.categorie.image;
      });
  }

  config() {
    this.categorieService.configCategories().subscribe((res: any) => {
      this.categories_first = res.categories_first;
      this.categories_second = res.categories_second;
    });
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
    this.categorieService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.categorieService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeCategorie(categorie: number) {
    this.type_categorie = categorie;
    this.categorie_second_id = '';
    this.categorie_third_id = '';
  }

  changeDepartment() {
    this.categories_second_filtered = this.categories_second.filter(
      (item: any) => item.categorie_second_id == this.categorie_third_id
    );
  }

  save() {
    if (!this.name || !this.position) {
      this.toastr.error('Validacion', 'Los campos con el * son obligatorios');
      return;
    }

    if (this.type_categorie === 1 && !this.icon) {
      this.toastr.error('Validacion', 'El icono es obligatorio');
      return;
    }

    // if (this.type_categorie === 1 && !this.file_image) {
    //   this.toastr.error('Validacion', 'La imagen es obligatoria');
    //   return;
    // }

    if (this.type_categorie === 2 && !this.categorie_second_id) {
      this.toastr.error('Validacion', 'El departamento es obligatorio');
      return;
    }

    if (
      this.type_categorie === 3 &&
      (!this.categorie_second_id || !this.categorie_third_id)
    ) {
      this.toastr.error(
        'Validacion',
        'El departamento y la categoria son obligatorios'
      );
      return;
    }

    let formData = new FormData();
    formData.append('name', this.name);
    if (this.icon) {
      formData.append('icon', this.icon);
    } else {
      if (this.CATEGORIE.icon) {
        formData.append('icon', '');
      }
    }
    formData.append('position', this.position + '');
    formData.append('type_categorie', this.type_categorie + '');
    if (this.file_image) {
      formData.append('imagen', this.file_image);
    }

    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }

    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }

    formData.append('state', this.state);

    this.categorieService
      .updateCategories(this.CATEGORIE_ID, formData)
      .subscribe((res: any) => {
        console.log(res);

        if (res.message == 403) {
          this.toastr.error('Validacion', 'La categoria ya existe');
          return;
        }

        this.toastr.success('Exito', 'La categoria se actualizó correctamente');
        this.config();
      });
  }
}
