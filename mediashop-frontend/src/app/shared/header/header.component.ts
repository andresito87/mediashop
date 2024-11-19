import { afterNextRender, Component, Inject, PLATFORM_ID } from '@angular/core';
import { HomeService } from '../../pages/home/service/home.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  categories_menu: any = [];
  currency: string = 'EUR';
  constructor(
    public homeService: HomeService,
    public cookieService: CookieService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    afterNextRender(() => {
      this.homeService.menus().subscribe((res: any) => {
        this.categories_menu = res.categories_menu;
      });
    });
  }

  ngOnInit(): void {
    this.homeService.menus().subscribe((res: any) => {
      this.categories_menu = res.categories_menu;
    });
    this.currency = this.cookieService.get('currency')
      ? this.cookieService.get('currency')
      : 'EUR';
  }

  getIconMenu(menu: any) {
    if (isPlatformBrowser(this.platformId)) {
      const miDiv = document.getElementById('icon-' + menu.id);
      if (miDiv) {
        this.renderer.setProperty(miDiv, 'innerHTML', menu.icon);
      }
    }
    return '';
  }

  changeCurrency(value: string) {
    this.cookieService.set('currency', value);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }
}
