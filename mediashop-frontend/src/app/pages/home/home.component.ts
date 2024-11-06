import { afterNextRender, Component, OnInit } from '@angular/core';
import { HomeService } from './service/home.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

declare var Swiper: any;
declare var $: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  SLIDERS: any = [];

  constructor(public homeService: HomeService) {
    afterNextRender(() => {
      this.homeService.home().subscribe((res: any) => {
        this.SLIDERS = res.sliders_principal;
        setTimeout(() => {
          var tp_rtl = localStorage.getItem('tp_dir');
          let rtl_setting = tp_rtl == 'rtl' ? 'right' : 'left';
          var mainSlider = new Swiper('.tp-slider-active', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            rtl: rtl_setting,
            effect: 'fade',
            // Navigation arrows
            navigation: {
              nextEl: '.tp-slider-button-next',
              prevEl: '.tp-slider-button-prev',
            },
            pagination: {
              el: '.tp-slider-dot',
              clickable: true,
              renderBullet: function (index: any, className: any) {
                return (
                  '<span class="' +
                  className +
                  '">' +
                  '<button>' +
                  (index + 1) +
                  '</button>' +
                  '</span>'
                );
              },
            },
          });
        }, 50);
      });
    });
  }

  ngOnInit(): void {}

  getLabelSlider(slider: any) {
    let miDiv: any = document.getElementById('label-' + slider.id);
    miDiv.innerHTML = slider.label;
    return '';
  }

  getSubtitleSlider(slider: any) {
    let miDiv: any = document.getElementById('subtitle-' + slider.id);
    miDiv.innerHTML = slider.subtitle;
    return '';
  }
}
