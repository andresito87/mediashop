import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SlidersService } from '../service/sliders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-sliders',
  templateUrl: './edit-sliders.component.html',
  styleUrls: ['./edit-sliders.component.scss'],
})
export class EditSlidersComponent {
  title: string = '';
  label: string = '';
  subtitle: string = '';
  link: string = '';
  color: string = '';
  state: number = 1;
  image_preview: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;
  isLoading$: any;
  slider_id: string = '';

  constructor(
    public sliderService: SlidersService,
    public toastr: ToastrService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.sliderService.isLoading$;
    this.activatedRoute.params.subscribe((res) => {
      this.slider_id = res.id;
    });
    this.sliderService.showSlider(this.slider_id).subscribe((res: any) => {
      this.title = res.slider.title;
      this.label = res.slider.label;
      this.subtitle = res.slider.subtitle;
      this.link = res.slider.link;
      this.color = res.slider.color;
      this.state = res.slider.state;
      this.image_preview = res.slider.image;
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  save() {
    if (!this.title || !this.subtitle) {
      this.toastr.error('Validacion', 'Los campos con el * son obligatorios');
      return;
    }
    let formData = new FormData();
    formData.append('title', this.title);
    if (this.label) {
      formData.append('label', this.label);
    }
    formData.append('subtitle', this.subtitle);
    if (this.file_image) {
      formData.append('imagen', this.file_image);
    }
    if (this.link) {
      formData.append('link', this.link);
    }
    if (this.color) {
      formData.append('color', this.color);
    }

    this.sliderService
      .updateSliders(this.slider_id, formData)
      .subscribe((res: any) => {
        this.toastr.success('Exito', 'El carrusel se actualizó correctamente');
      });
  }
}
