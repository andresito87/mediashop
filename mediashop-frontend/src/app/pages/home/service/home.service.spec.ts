import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HomeService } from './home.service';
import { AuthService } from '../../auth/service/auth.service';
import { of } from 'rxjs';
import { URL_SERVICIOS } from '../../../config/config';

describe('HomeService', () => {
  let service: HomeService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['someMethod']); // Mock del AuthService

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa el módulo para mockear las peticiones HTTP
      providers: [
        HomeService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify(); // Asegúrate de que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call home() and return data', () => {
    const mockResponse = { data: 'test' };

    // Llamar al método
    service.home().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Configurar el mock de la solicitud HTTP
    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/home'); // URL_SERVICIOS debería ser configurado correctamente
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Responder con el mock
  });

  it('should call menus() and return menus', () => {
    const mockMenus = { categories_menu: ['Electronics', 'Fashion', 'Beauty'] };

    service.menus().subscribe((response) => {
      expect(response).toEqual(mockMenus);
    });

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/menus');
    expect(req.request.method).toBe('GET');
    req.flush(mockMenus);
  });

  it('should call showProduct() with correct parameters and return product data', () => {
    const slug = 'product-123';
    const code_discount = 'DISCOUNT50';
    const mockProduct = { id: 1, name: 'Product 1', price: 100 };

    service.showProduct(slug, code_discount).subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(
      `${URL_SERVICIOS}/ecommerce/product/${slug}?campaign_discount=${code_discount}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should handle errors in home()', () => {
    const errorMessage = '404 Not Found';

    service.home().subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/home');
    req.flush(errorMessage, { status: 404, statusText: errorMessage });
  });

  it('should handle errors in menus()', () => {
    const errorMessage = '500 Internal Server Error';

    service.menus().subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/menus');
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });
});
