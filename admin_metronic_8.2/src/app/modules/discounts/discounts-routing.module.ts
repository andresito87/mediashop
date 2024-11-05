import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountsComponent } from './discounts.component';
import { EditDiscountComponent } from './edit-discount/edit-discount.component';
import { CreateDiscountComponent } from './create-discount/create-discount.component';
import { ListDiscountComponent } from './list-discount/list-discount.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountsComponent,
    children: [
      {
        path: 'register',
        component: CreateDiscountComponent,
      },
      {
        path: 'list',
        component: ListDiscountComponent,
      },
      {
        path: 'list/edit/:id',
        component: EditDiscountComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountsRoutingModule {}
