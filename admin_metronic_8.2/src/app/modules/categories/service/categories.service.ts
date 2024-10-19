import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, public authservice: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  listCategories(page: number = 1, search: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL =
      URL_SERVICIOS + '/admin/categories?page=' + page + '&search=' + search;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  configCategories() {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/categories/config';

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  createCategories(data: any) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/categories';

    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  showCategorie(categorie_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/categories/' + categorie_id;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateCategories(categorie_id: string, data: any) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/categories/' + categorie_id;

    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteCategorie(categorie_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/categories/' + categorie_id;

    return this.http
      .delete(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
}
