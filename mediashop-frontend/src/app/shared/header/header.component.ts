import { afterNextRender, Component } from '@angular/core';
import { HomeService } from '../../pages/home/service/home.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  categories_menu: any = [];
  constructor(public homeService: HomeService) {
    afterNextRender(() => {
      this.homeService.menus().subscribe((res: any) => {
        this.categories_menu = res.categories_menu;
      });
    });
  }

  getIconMenu(menu: any) {
    let miDiv: any = document.getElementById('icon-' + menu.id);
    miDiv.innerHTML = menu.icon;
    return '';
  }
}
