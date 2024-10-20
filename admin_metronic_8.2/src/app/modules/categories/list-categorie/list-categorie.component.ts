import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCategorieComponent } from '../delete-categorie/delete-categorie.component';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.scss'],
})
export class ListCategorieComponent {
  categories: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public categoriesService: CategoriesService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listCategories();
    this.isLoading$ = this.categoriesService.isLoading$;
  }

  listCategories(page: number = 1) {
    this.categoriesService
      .listCategories(page, this.search)
      .subscribe((res: any) => {
        console.log(res);
        this.categories = res.categories.data;
        this.totalPages = res.total;
        this.currentPage = page;
      });
  }

  searchTo() {
    this.listCategories();
  }

  loadPage($event: any) {
    this.listCategories($event);
  }

  getDomParser(categorie: any) {
    let miDiv: any = document.getElementById('svg-categorie-' + categorie.id);
    miDiv.innerHTML = categorie.icon;
    return '';
  }

  deleteCategorie(categorie: any) {
    const modalRef = this.modalService.open(DeleteCategorieComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.categorie = categorie;

    modalRef.componentInstance.CategorieD.subscribe((res: any) => {
      let INDEX = this.categories.findIndex(
        (item: any) => item.id === categorie.id
      );
      if (INDEX != -1) {
        this.categories.splice(INDEX, 1);
      }
    });
  }
}
