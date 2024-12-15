import { Component } from '@angular/core';
import { ProfileClientService } from '../service/profile-client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders-profile-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders-profile-client.component.html',
  styleUrl: './orders-profile-client.component.css',
})
export class OrdersProfileClientComponent {
  sales: any = [];

  constructor(public profileClientService: ProfileClientService) {
    this.profileClientService.showOrders().subscribe((res: any) => {
      this.sales = res.sales.data;
    });
  }

  detailShow(sale: any) {
    sale.sale_detail_show = !sale.sale_detail_show;
  }
}
