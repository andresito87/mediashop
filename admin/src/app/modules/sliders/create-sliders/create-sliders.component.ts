import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SlidersService } from '../service/sliders.service';

@Component({
  selector: 'app-create-sliders',
  templateUrl: './create-sliders.component.html',
  styleUrls: ['./create-sliders.component.scss'],
})
export class CreateSlidersComponent {
  title: string = '';
  label: string = '';
  subtitle: string = '';
  link: string = '';
  color: string = '';

  image_preview: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;
  type_slider: any = 1;
  price_original: any = null; // product price before campaign starts
  price_campaign: any = null; // product price during the campaign

  isLoading$: any;

  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.sliderService.isLoading$;
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  save() {
    if (!this.title || !this.subtitle || !this.file_image) {
      this.toastr.error('Validacion', 'Los campos con el * son obligatorios');
      return;
    }
    let formData = new FormData();
    formData.append('title', this.title);
    if (this.label) {
      formData.append('label', this.label);
    }
    formData.append('subtitle', this.subtitle);
    formData.append('imagen', this.file_image);

    formData.append('type_slider', this.type_slider);

    if (this.price_original) {
      formData.append('price_original', this.price_original);
    }

    if (this.price_campaign) {
      formData.append('price_campaign', this.price_campaign);
    }

    if (this.link) {
      formData.append('link', this.link);
    }
    if (this.color) {
      formData.append('color', this.color);
    }

    this.sliderService.createSliders(formData).subscribe((res: any) => {
      // clean form
      this.title = '';
      this.label = '';
      this.subtitle = '';
      this.link = '';
      this.color = '#000000';
      this.file_image = null;
      this.image_preview =
        'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
      this.toastr.success('Exito', 'El slider se registró correctamente');
    });
  }
}
