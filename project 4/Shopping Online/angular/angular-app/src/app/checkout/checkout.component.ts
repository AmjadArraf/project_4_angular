import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuardService } from 'src/services/hiddenlogin';

@Component({
  selector: 'app-checkout',
  template: `<div class="checkMain">
    <div>
    <div *ngFor="let product of dataReceived">
    <div>
    <p>Product: {{ product.name }}</p>
    <p>Price: {{ product.price | currency: 'ILS': 'symbol-narrow'}}</p>
    <p>Amount: {{ product.amount}}</p>
    <p>==================================</p>
    </div>
    <div>
      Total: {{ totalSum | currency: 'ILS': 'symbol-narrow'}}
    </div>
    </div>
    </div>

    <div>
    <form (submit)="onCheckout()">
  <label>
    First Name:
    <input type="text" name="firstName" [(ngModel)]="firstName">
  </label>
  <br>
  <label>
    Last Name:
    <input type="text" name="lastName" [(ngModel)]="lastName">
  </label>
  <br>
  <label>
    Email:
    <input type="email" name="email" [(ngModel)]="email">
  </label>
  <br>
  <label>
    Address:
    <input type="text" name="address" [(ngModel)]="address">
  </label>
  <br>
  <label>
    Credit Card Number:
    <input type="number" name="creditNumber" [(ngModel)]="creditNumber">
  </label>
  <br>
  <button type="submit">Submit</button>
</form>
<button (click)="onCancel()">Cancel</button>
    </div>

    <div *ngIf="ngifParameter">
      <p>payment successful</p>
      <button>print Invoice</button>
      <button (click)="onCancel()">return to store page</button>
    </div>
  </div>`,
  styles: [
    '.checkMain{display: flex !important;}',
    'form{margin-left: 30px}'
    ]
})
export class CheckoutComponent implements OnInit{
  dataReceived: any;
  totalSum: any;
  firstName: any;
  lastName: any;
  email: any;
  address: any;
  creditNumber: any;

  checkoutData: any;

  ngifParameter: any;


  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router, private authGuardService: AuthGuardService,) {
    const jsonData = this.cookieService.get('checkout');
    this.dataReceived = JSON.parse(jsonData)
  }

  ngOnInit() {
      this.total()
  }

  // calculates the total price of all the products
  total(){
    let sum = 0
    for(const product of this.dataReceived){
      sum = sum + ((product.amount)*(product.price))
    }
    this.totalSum = sum
  }

// gathers and sends necessary information for checkout
  onCheckout(){
    this.checkoutData = {
      "firstName": this.firstName,
        "familyName": this.lastName,
        "email": this.email,
        "address": this.address,
        "creditNumber": this.creditNumber,
        "totalSum": this.totalSum
    }
    
    // this.ngifParameter = true
  }

  // returns to the store page if cancel button is pressed
  onCancel(){
    this.authGuardService.setRequiredRoles(['user']);
            this.router.navigate(['/insideStore']);
  }
}
