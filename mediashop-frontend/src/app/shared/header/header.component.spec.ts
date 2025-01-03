import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { HomeService } from '../../pages/home/service/home.service';
import { CartService } from '../../pages/home/service/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProfileClientService } from './../../pages/view-auth/profile-client/service/profile-client.service';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { CartItem } from '../../pages/home/interfaces/cart-item';
import { HttpResponse } from '@angular/common/http';

describe('HeaderComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HeaderComponent, // Usamos el HeaderComponent como standalone
        FooterComponent, // Importa FooterComponent si es necesario
        HttpClientTestingModule, // Importa para realizar pruebas con HttpClient
        ToastrModule.forRoot(), // Para usar ToastrService
      ],
      providers: [
        {
          provide: HomeService,
          useValue: jasmine.createSpyObj('HomeService', ['menus']),
        },
        {
          provide: CartService,
          useValue: jasmine.createSpyObj('CartService', [
            'listCart',
            'changeCart',
            'deleteCart',
            'removeCart',
            'deleteCartsAll',
          ]),
          currentDataCart$: new BehaviorSubject<CartItem[]>([]),
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['info']),
        },
        {
          provide: ProfileClientService,
          useValue: jasmine.createSpyObj('ProfileClientService', ['showUsers']),
        },
        {
          provide: CookieService,
          useValue: jasmine.createSpyObj('CookieService', [
            'get',
            'set',
            'delete',
          ]),
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } },
        }, // Simulación de ActivatedRoute
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignorar errores de elementos personalizados
    }).compileComponents();
  }));

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let homeServiceSpy: jasmine.SpyObj<HomeService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let profileClientServiceSpy: jasmine.SpyObj<ProfileClientService>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    homeServiceSpy = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    profileClientServiceSpy = TestBed.inject(
      ProfileClientService
    ) as jasmine.SpyObj<ProfileClientService>;
    cookieServiceSpy = TestBed.inject(
      CookieService
    ) as jasmine.SpyObj<CookieService>;

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the HeaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteCart and display Toastr message when deleting a cart', () => {
    const mockCart = { id: '1', product: { title: 'Product 1' } };
    cartServiceSpy.deleteCart.and.returnValue(
      of(new HttpResponse({ body: mockCart }))
    );

    component.deleteCart(mockCart);

    expect(cartServiceSpy.deleteCart).toHaveBeenCalledWith('1');
    expect(toastrSpy.info).toHaveBeenCalledWith(
      'Eliminación',
      'Se ha eliminado el producto Product 1 del carrito de compra'
    );
  });

  it('should log out the user when logout is called', () => {
    // Asegúrate de que authService esté correctamente simulado
    cartServiceSpy.authService = jasmine.createSpyObj('AuthService', [
      'logout',
    ]);

    // Ejecuta el método logout
    component.logout();

    // Verifica que el método logout haya sido llamado
    expect(cartServiceSpy.authService.logout).toHaveBeenCalled();
  });
});
