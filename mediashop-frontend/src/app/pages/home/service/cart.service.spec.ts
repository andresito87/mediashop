import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { AuthService } from '../../auth/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CartItem } from '../interfaces/cart-item';
import { BehaviorSubject } from 'rxjs';
import { URL_SERVICIOS } from '../../../config/config';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceMock.getToken.and.returnValue('mock-token'); // Simula el token

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CartService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change the cart', () => {
    const mockCartItem: CartItem = {
      id: '1',
      product_id: 'prod1',
      discount: 10,
      quantity: 1,
      subtotal: 50,
      total: 45,
      currency: 'USD',
    };

    // Simula el método `changeCart`
    spyOn(service, 'changeCart').and.callThrough();

    service.changeCart(mockCartItem);
    expect(service.cart.getValue().length).toBe(1);
    expect(service.cart.getValue()[0]).toEqual(mockCartItem);
  });

  it('should reset the cart', () => {
    service.resetCart();
    expect(service.cart.getValue().length).toBe(0);
  });

  it('should remove an item from the cart', () => {
    const mockCartItem: CartItem = {
      id: '1',
      product_id: 'prod1',
      discount: 10,
      quantity: 1,
      subtotal: 50,
      total: 45,
      currency: 'USD',
    };

    // Añadir un item al carrito
    service.changeCart(mockCartItem);
    expect(service.cart.getValue().length).toBe(1);

    service.removeCart('1');
    expect(service.cart.getValue().length).toBe(0);
  });

  it('should list the cart items', () => {
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        product_id: 'prod1',
        discount: 10,
        quantity: 1,
        subtotal: 50,
        total: 45,
        currency: 'USD',
      },
      {
        id: '2',
        product_id: 'prod2',
        discount: 5,
        quantity: 2,
        subtotal: 60,
        total: 55,
        currency: 'USD',
      },
    ];

    // Simula la respuesta del servicio
    service.listCart().subscribe((response) => {
      expect(response).toEqual(mockCartItems);
    });

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/carts/');
    expect(req.request.method).toBe('GET');
    req.flush(mockCartItems);
  });

  it('should register the cart', () => {
    const cartData = { product_id: 'prod1', quantity: 1 };

    service.registerCart(cartData).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/carts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cartData);
    req.flush({ success: true });
  });

  it('should update the cart', () => {
    const updatedCartItem: CartItem = {
      id: '1',
      product_id: 'prod1',
      discount: 15,
      quantity: 2,
      subtotal: 100,
      total: 90,
      currency: 'USD',
    };

    const cartId = '1';

    service.updateCart(cartId, updatedCartItem).subscribe((response) => {
      expect(response.status).toBe(200); // Suponiendo que la respuesta es exitosa
    });

    const req = httpMock.expectOne(
      URL_SERVICIOS + `/ecommerce/carts/${cartId}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCartItem);
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should delete the cart', () => {
    const cartId = '1';

    service.deleteCart(cartId).subscribe((response: any) => {
      expect(response.status).toBe(200); // Suponiendo que la respuesta es exitosa
    });

    const req = httpMock.expectOne(
      URL_SERVICIOS + `/ecommerce/carts/${cartId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should delete all carts', () => {
    service.deleteCartsAll().subscribe((response: any) => {
      expect(response.status).toBe(200); // Suponiendo que la respuesta es exitosa
    });

    const req = httpMock.expectOne(
      URL_SERVICIOS + '/ecommerce/carts/delete_all'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should apply coupon', () => {
    const couponData = { code_coupon: 'DISCOUNT50' };

    service.applyCoupon(couponData).subscribe((response) => {
      expect(response.status).toBe(200); // Suponiendo que la respuesta es exitosa
    });

    const req = httpMock.expectOne(
      URL_SERVICIOS + '/ecommerce/carts/apply_coupon'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(couponData);
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should checkout', () => {
    const checkoutData = { cart_id: '1' };

    service.checkout(checkoutData).subscribe((response) => {
      expect(response.status).toBe(200); // Suponiendo que la respuesta es exitosa
    });

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/checkout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(checkoutData);
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should show the order', () => {
    const saleId = '123';

    service.showOrder(saleId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(URL_SERVICIOS + `/ecommerce/sale/${saleId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true });
  });

  it('should handle errors in changeCart()', () => {
    const mockCartItem: CartItem = {
      id: '1',
      product_id: 'prod1',
      discount: 10,
      quantity: 1,
      subtotal: 50,
      total: 45,
      currency: 'USD',
    };

    service.changeCart(mockCartItem);
    expect(service.cart.getValue().length).toBe(1);

    service.changeCart(mockCartItem);
    expect(service.cart.getValue().length).toBe(1);
  });

  it('should handle errors in listCart()', () => {
    const errorMessage = '404 Not Found';

    service.listCart().subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/carts/');
    req.flush(errorMessage, { status: 404, statusText: errorMessage });
  });

  it('should handle errors in registerCart()', () => {
    const errorMessage = '500 Internal Server Error';

    service.registerCart({}).subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/carts');
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });

  it('should handle errors in listCart()', () => {
    const errorMessage = '404 Not Found';

    service.listCart().subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/carts/');
    req.flush(errorMessage, { status: 404, statusText: errorMessage });
  });

  it('should handle errors in registerCart()', () => {
    const errorMessage = '500 Internal Server Error';

    service.registerCart({}).subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/carts');
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });

  it('should handle errors in updateCart()', () => {
    const errorMessage = '500 Internal Server Error';

    service
      .updateCart('1', {
        id: '',
        product_id: '',
        discount: 0,
        quantity: 0,
        subtotal: 0,
        total: 0,
        currency: '',
      })
      .subscribe(
        () => fail('expected an error, not data'),
        (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        }
      );

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/carts/1');
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });

  it('should handle errors in deleteCart()', () => {
    const errorMessage = '500 Internal Server Error';

    service.deleteCart('1').subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(URL_SERVICIOS + '/ecommerce/carts/1');
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });

  it('should handle errors in deleteCartsAll()', () => {
    const errorMessage = '500 Internal Server Error';

    service.deleteCartsAll().subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(
      URL_SERVICIOS + '/ecommerce/carts/delete_all'
    );
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });
});
