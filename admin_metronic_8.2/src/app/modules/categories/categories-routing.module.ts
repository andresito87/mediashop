import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { CreateCategorieComponent } from './create-categorie/create-categorie.component';
import { EditCategorieComponent } from './edit-categorie/edit-categorie.component';
import { ListCategorieComponent } from './list-categorie/list-categorie.component';
import { DeleteCategorieComponent } from './delete-categorie/delete-categorie.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: 'register',
        component: CreateCategorieComponent,
      },
      {
        path: 'edit/:id',
        component: EditCategorieComponent,
      },
      {
        path: 'list',
        component: ListCategorieComponent,
      },
      {
        path: 'delete/:id',
        component: DeleteCategorieComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
