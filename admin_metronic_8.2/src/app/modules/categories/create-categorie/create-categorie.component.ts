import { Component } from '@angular/core';

@Component({
  selector: 'app-create-categorie',
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss'],
})
export class CreateCategorieComponent {
  type_categorie: number = 1;

  processFile($event: any) {}

  changeTypeCategorie(categorie: number) {
    this.type_categorie = categorie;
  }
}
