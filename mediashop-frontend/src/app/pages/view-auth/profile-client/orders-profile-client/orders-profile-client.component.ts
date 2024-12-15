import { Component } from '@angular/core';
import { ProfileClientService } from '../service/profile-client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

@Component({
  selector: 'app-orders-profile-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders-profile-client.component.html',
  styleUrl: './orders-profile-client.component.css',
})
export class OrdersProfileClientComponent {
  sales: any = [];
  sale_detail_review: any;
  rating: number = 0;
  message: string = '';

  constructor(
    public profileClientService: ProfileClientService,
    public toastr: ToastrService
  ) {
    this.profileClientService.showOrders().subscribe((res: any) => {
      this.sales = res.sales.data;
    });
  }

  detailShow(sale: any) {
    sale.sale_detail_show = !sale.sale_detail_show;
  }

  reviewShow(detail: any) {
    this.sale_detail_review = detail;

    //if it has a review
    if (this.sale_detail_review.review) {
      this.rating = this.sale_detail_review.review.rating;
      this.message = this.sale_detail_review.review.message;
    }
  }

  selectedRating(value: number) {
    this.rating = value;
  }

  // function to leave the process
  backToList() {
    this.sale_detail_review = null;
    this.rating = 0;
    this.message = '';
  }

  saveReview() {
    if (!this.message || !this.rating) {
      this.toastr.error(
        'Validacion',
        'Necesitas seleccionar una calificación y rellernar la reseña'
      );
      return;
    }

    let data = {
      product_id: this.sale_detail_review.product_id,
      sale_detail_id: this.sale_detail_review.id,
      message: this.message,
      rating: this.rating,
    };

    if (this.sale_detail_review.review) {
      this.profileClientService
        .updateReview(this.sale_detail_review.review.id, data)
        .subscribe({
          next: (res: any) => {
            if (res.status == 200) {
              this.toastr.success('Éxito', 'Reseña editada correctamente');
              this.sale_detail_review.review = res.body.review;
            }
          },
          error: (err: any) => {
            this.toastr.error('Validación', 'Error en la operación de edición');
          },
        });
    } else {
      this.profileClientService.registerReview(data).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.toastr.success('Éxito', 'Reseña guardada correctamente');
            this.sale_detail_review.review = res.body.review;
          }
        },
        error: (err: any) => {
          this.toastr.error('Validación', 'Error en la operación de guardado');
        },
      });
    }
  }
}
