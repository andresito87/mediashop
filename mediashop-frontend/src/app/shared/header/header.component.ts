import { CartItem } from './../../pages/home/interfaces/cart-item';
import { afterNextRender, Component, Inject, PLATFORM_ID } from '@angular/core';
import { HomeService } from '../../pages/home/service/home.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Renderer2 } from '@angular/core';
import { CartService } from '../../pages/home/service/cart.service';
import { ToastrService } from 'ngx-toastr';

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

  user: any;
  listCarts: any = [];
  totalCarts: number = 0;
  constructor(
    public homeService: HomeService,
    public cookieService: CookieService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    public cartService: CartService,
    private toastr: ToastrService
  ) {
    afterNextRender(() => {
      this.homeService.menus().subscribe((res: any) => {
        this.categories_menu = res.categories_menu;
      });

      this.user = this.cartService.authService.user;
      if (this.user) {
        this.cartService.listCart().subscribe((res: any) => {
          res.carts.data.forEach((item: CartItem) => {
            this.cartService.changeCart(item);
          });
        });
      }
    });
  }

  ngOnInit(): void {
    // change currency
    this.homeService.menus().subscribe((res: any) => {
      this.categories_menu = res.categories_menu;
    });
    this.currency = this.cookieService.get('currency')
      ? this.cookieService.get('currency')
      : 'EUR';

    this.cartService.currentDataCart$.subscribe((res: CartItem[]) => {
      this.listCarts = res;
      this.totalCarts = this.listCarts.reduce(
        (sum: number, item: CartItem) => sum + item.total,
        0
      );
    });
  }

  deleteCart(cart: any) {
    this.cartService.deleteCart(cart.id).subscribe((res: any) => {
      this.toastr.info(
        'Eliminación',
        'Se ha eliminado el producto ' +
          cart.product.title +
          ' del carrito de compra'
      );
      this.cartService.removeCart(cart.id);
    });
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
