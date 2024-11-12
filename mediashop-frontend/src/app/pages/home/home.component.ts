import { afterNextRender, Component, OnInit } from '@angular/core';
import { HomeService } from './service/home.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

declare function SLIDER_PRINCIPAL([]: any): any;
declare var $: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  SLIDERS: any = [];
  CATEGORIES_RANDOMS: any = [];

  TRENDING_PRODUCTS_NEW: any = [];
  TRENDING_PRODUCTS_FEATURED: any = [];
  TRENDING_PRODUCTS_TOP_SELLER: any = [];

  constructor(public homeService: HomeService) {
    afterNextRender(() => {
      this.homeService.home().subscribe((res: any) => {
        console.log(res);
        this.SLIDERS = res.sliders_principal;
        this.CATEGORIES_RANDOMS = res.categories_random;
        this.TRENDING_PRODUCTS_NEW = res.products_trending_new.data;
        this.TRENDING_PRODUCTS_FEATURED = res.products_trending_featured.data;
        this.TRENDING_PRODUCTS_TOP_SELLER =
          res.products_trending_top_sellers.data;
        setTimeout(() => {
          SLIDER_PRINCIPAL($);
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
