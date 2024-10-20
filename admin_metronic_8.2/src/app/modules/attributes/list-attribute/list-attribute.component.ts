import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAttributeComponent } from '../delete-attribute/delete-attribute.component';
import { AttributesService } from '../service/attributes.service';
import { CreateAttributeComponent } from '../create-attribute/create-attribute.component';
import { EditAttributeComponent } from '../edit-attribute/edit-attribute.component';

@Component({
  selector: 'app-list-attribute',
  templateUrl: './list-attribute.component.html',
  styleUrls: ['./list-attribute.component.scss'],
})
export class ListAttributeComponent {
  attributes: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  isLoading$: any;

  constructor(
    public attributesService: AttributesService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listAttributes();
    this.isLoading$ = this.attributesService.isLoading$;
  }

  listAttributes(page: number = 1) {
    this.attributesService
      .listAttributes(page, this.search)
      .subscribe((res: any) => {
        this.attributes = res.attributes;
        this.totalPages = res.total;
        this.currentPage = page;
      });
  }

  getNameAttribute(type_attribute: any) {
    let name_attribute = '';
    type_attribute = parseInt(type_attribute);
    switch (type_attribute) {
      case 1:
        name_attribute = 'Texto';
        break;
      case 2:
        name_attribute = 'Numero';
        break;
      case 3:
        name_attribute = 'Seleccionable';
        break;
      case 4:
        name_attribute = 'Seleccionable Multiple';
        break;
      default:
        break;
    }

    return name_attribute;
  }

  searchTo() {
    this.listAttributes();
  }

  loadPage($event: any) {
    this.listAttributes($event);
  }

  openModalCreateAttribute() {
    const modalRef = this.modalService.open(CreateAttributeComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.AttributeC.subscribe((attribute: any) => {
      this.attributes.unshift(attribute);
    });
  }

  openModalEditAttribute(attribute: any) {
    const modalRef = this.modalService.open(EditAttributeComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.attribute = attribute;

    modalRef.componentInstance.AttributeEdit.subscribe((attribute: any) => {
      //this.attributes.unshift(attribute);

      // get position of attribute which we are going to modify
      let INDEX = this.attributes.findIndex(
        (item: any) => item.id == attribute.id
      );
      if (INDEX != -1) {
        this.attributes[INDEX] = attribute;
      }
    });
  }

  deleteAttribute(attribute: any) {
    const modalRef = this.modalService.open(DeleteAttributeComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.attribute = attribute;

    modalRef.componentInstance.AttributeDelete.subscribe((res: any) => {
      let INDEX = this.attributes.findIndex(
        (item: any) => item.id == attribute.id
      );
      if (INDEX != -1) {
        this.attributes.splice(INDEX, 1);
      }
    });
  }
}
