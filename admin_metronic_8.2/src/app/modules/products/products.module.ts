import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbModule,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DeleteImageAddComponent } from './edit-product/delete-image-add/delete-image-add.component';
import { CreateVariationsSpecificationsComponent } from './attributes/create-variations-specifications/create-variations-specifications.component';
import { EditVariationsSpecificationsComponent } from './attributes/edit-variations-specifications/edit-variations-specifications.component';
import { DeleteVariationsSpecificationsComponent } from './attributes/delete-variations-specifications/delete-variations-specifications.component';
import { CreateNestedVariationsComponent } from './attributes/create-nested-variations/create-nested-variations.component';
import { EditNestedVariationsComponent } from './attributes/edit-nested-variations/edit-nested-variations.component';
import { DeleteNestedVariationsComponent } from './attributes/delete-nested-variations/delete-nested-variations.component';

@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    ListProductsComponent,
    DeleteProductComponent,
    DeleteImageAddComponent,
    CreateVariationsSpecificationsComponent,
    EditVariationsSpecificationsComponent,
    DeleteVariationsSpecificationsComponent,
    CreateNestedVariationsComponent,
    EditNestedVariationsComponent,
    DeleteNestedVariationsComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    CKEditorModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class ProductsModule {}
