import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, public authservice: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  configAll() {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations/config';

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  showProduct(product_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/products/' + product_id;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  /************************** SPECIFICATIONS **************************/
  listSpecifications(product_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/specifications?product_id=' + product_id;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  createSpecification(data: any) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/specifications';

    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateSpecification(spedification_id: string, data: any) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/specifications/' + spedification_id;

    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteSpecification(specification_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/specifications/' + specification_id;

    return this.http
      .delete(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  /************************** VARIATIONS **************************/
  listVariations(product_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations?product_id=' + product_id;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  createVariation(data: any) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations';

    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateVariation(variation_id: string, data: any) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations/' + variation_id;

    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteVariation(variation_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/variations/' + variation_id;

    return this.http
      .delete(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  /********************** NESTED VARIATIONS **********************/
  listNestedVariations(product_id: string, product_variation_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL =
      URL_SERVICIOS +
      '/admin/nested_variations?product_id=' +
      product_id +
      '&product_variation_id=' +
      product_variation_id;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  createNestedVariation(data: any) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/nested_variations';

    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateNestedVariation(variation_id: string, data: any) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/nested_variations/' + variation_id;

    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteNestedVariation(variation_id: string) {
    //isLoadingSubject when is true => init request, false => finalize request
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/admin/nested_variations/' + variation_id;

    return this.http
      .delete(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
}
