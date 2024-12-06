import { CookieService } from 'ngx-cookie-service';
import { CartItem } from '../../home/interfaces/cart-item';
import { CartService } from './../../home/service/cart.service';
import {
  afterNextRender,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { UserAddressService } from '../service/user-address.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var paypal: any;
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  listCarts: any = [];
  totalCarts: number = 0;
  currency: string = 'EUR';
  addresses: any = [];

  name: string = '';
  surname: string = '';
  company: string = '';
  country_region: string = '';
  city: string = '';
  street_address: string = '';
  postcode_zip: string = '';
  phone: string = '';
  email: string = '';

  address_selected: any;
  description: string = '';

  @ViewChild('paypal', { static: true }) paypalElement?: ElementRef;

  constructor(
    public cartService: CartService,
    public cookieService: CookieService,
    public addressService: UserAddressService,
    private toastr: ToastrService,
    public router: Router
  ) {
    afterNextRender(() => {
      this.addressService.listAddress().subscribe((res: any) => {
        this.addresses = res.addresses;
      });
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.currency = this.cookieService.get('currency')
      ? this.cookieService.get('currency')
      : 'EUR';
    this.cartService.currentDataCart$.subscribe((res: any) => {
      this.listCarts = res;
      this.totalCarts = this.listCarts.reduce(
        (sum: number, item: CartItem) => sum + item.total,
        0
      );
    });

    paypal
      .Buttons({
        // optional styling for buttons
        // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
        style: {
          color: 'gold',
          shape: 'rect',
          layout: 'vertical',
        },

        // set up the transaction
        createOrder: (data: any, actions: any) => {
          // pass in any options from the v2 orders create call:
          // https://developer.paypal.com/api/orders/v2/#orders-create-request-body

          if (this.totalCarts == 0) {
            this.toastr.error(
              'Validción',
              'No puedes procesar el pago con un total de 0'
            );
            return;
          }

          if (this.listCarts.length == 0) {
            this.toastr.error(
              'Validción',
              'No puedes procesar el pago con un carrito de compra vacío'
            );
            return;
          }

          if (
            !this.name ||
            !this.surname ||
            !this.company ||
            !this.country_region ||
            !this.city ||
            !this.street_address ||
            !this.postcode_zip ||
            !this.phone ||
            !this.email
          ) {
            this.toastr.error(
              'Validación',
              'Todos los campos de la dirección son necesarios'
            );
            return;
          }

          const createOrderPayload = {
            purchase_units: [
              {
                amount: {
                  description: 'COMPRAR POR EL ECOMMERCE',
                  value: this.totalCarts,
                },
              },
            ],
          };

          return actions.order.create(createOrderPayload);
        },

        // finalize the transaction
        onApprove: async (data: any, actions: any) => {
          let Order = await actions.order.capture();
          // Order.purchase_units[0].payments.captures[0].id

          let dataSale = {
            method_payment: 'PAYPAL',
            currency_total: this.currency,
            currency_payment: 'USD',
            discount: 0,
            subtotal: this.totalCarts,
            total: this.totalCarts,
            price_dolar: 0,
            code_transaction: Order.purchase_units[0].payments.captures[0].id,
            description: this.description,
            sale_address: {
              name: this.name,
              surname: this.surname,
              company: this.company,
              country_region: this.country_region,
              city: this.city,
              street_address: this.street_address,
              postcode_zip: this.postcode_zip,
              phone: this.phone,
              email: this.email,
            },
          };
          this.cartService.checkout(dataSale).subscribe({
            next: (res: any) => {
              this.toastr.success(
                'Éxito',
                'La compra se ha realizado correctamente'
              );
              // clean the shopping cart
              this.cartService.resetCart();
              // redirect to gratefull page
              setTimeout(() => {
                this.router.navigateByUrl(
                  '/thank-you-for-your-purchase/' +
                    Order.purchase_units[0].payments.captures[0].id
                );
              }, 50);
            },
            error: (err: any) => {
              this.toastr.error('Error', err.error.message);
            },
          });
          // return actions.order.capture().then(captureOrderHandler);
        },

        // handle unrecoverable errors
        onError: (err: any) => {
          console.error(
            'An error prevented the buyer from checking out with PayPal'
          );
        },
      })
      .render(this.paypalElement?.nativeElement);
  }

  registerAddress() {
    if (
      !this.name ||
      !this.surname ||
      !this.company ||
      !this.country_region ||
      !this.city ||
      !this.street_address ||
      !this.postcode_zip ||
      !this.phone ||
      !this.email
    ) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      surname: this.surname,
      company: this.company,
      country_region: this.country_region,
      city: this.city,
      street_address: this.street_address,
      postcode_zip: this.postcode_zip,
      phone: this.phone,
      email: this.email,
    };

    this.addressService.registerAddress(data).subscribe((res: any) => {
      this.addresses.unshift(res.address);
      this.toastr.success('Éxito', 'Dirección registrada correctamente');
    });
  }

  editAddress() {
    if (
      !this.name ||
      !this.surname ||
      !this.company ||
      !this.country_region ||
      !this.city ||
      !this.street_address ||
      !this.postcode_zip ||
      !this.phone ||
      !this.email
    ) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      surname: this.surname,
      company: this.company,
      country_region: this.country_region,
      city: this.city,
      street_address: this.street_address,
      postcode_zip: this.postcode_zip,
      phone: this.phone,
      email: this.email,
    };

    this.addressService
      .updateAddress(this.address_selected.id, data)
      .subscribe((res: any) => {
        let index = this.addresses.findIndex((item: any) => {
          item.id == res.body.address.id;
        });
        if (index != -1) {
          this.addresses[index] = res.address;
        }

        this.toastr.success('Éxito', 'Dirección actualizada correctamente');
      });
  }

  selectedAddress(address: any) {
    this.address_selected = address;
    this.name = this.address_selected.name;
    this.surname = this.address_selected.surname;
    this.company = this.address_selected.company;
    this.country_region = this.address_selected.country_region;
    this.city = this.address_selected.city;
    this.street_address = this.address_selected.street_address;
    this.postcode_zip = this.address_selected.postcode_zip;
    this.phone = this.address_selected.phone;
    this.email = this.address_selected.email;
  }

  resetAddress() {
    this.address_selected = null;
    this.name = '';
    this.surname = '';
    this.company = '';
    this.country_region = '';
    this.city = '';
    this.street_address = '';
    this.postcode_zip = '';
    this.phone = '';
    this.email = '';
  }
}
