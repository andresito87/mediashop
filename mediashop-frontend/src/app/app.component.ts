import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare var $: any;
declare function HOMEINIT([]): any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'mediashop-frontend';
  constructor() {
    setTimeout(() => {
      HOMEINIT($);
    }, 50);
  }
}
