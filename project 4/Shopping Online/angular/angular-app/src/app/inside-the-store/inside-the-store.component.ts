import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuardService } from 'src/services/hiddenlogin';
import { PostData } from 'src/services/post';
import { PutData } from 'src/services/put';

@Component({
  selector: 'app-inside-the-store',
  template: `<div>
    <div class="navBarDiv">
      <h2>welcome {{name}}, you are logged in</h2>
    </div>

    <div class="storeConDiv">
    <div class="partOfView1">
    
    <div class="inside1">
    <h1>Cart</h1>
    <div class="cartProducts">
      <div class="cartProductsDiv" *ngFor="let product of cartProductsArray">
  <div class='cartPro'>
    <p>Product: {{ product.name }}</p>
    <p>Price: {{ product.price | currency: 'ILS': 'symbol-narrow'}}</p>
    <p>Amount: {{ product.amount}}</p>
    <button id="remove{{product.key}}" (click)="removeItem($event)">Remove Product</button>
    <div>
    </div>
  </div>
  
</div>
<h2>Total Amount: {{totalSum | currency: 'ILS': 'symbol-narrow'}}</h2>


      </div>

      <div class="registerBtn">
      <button *ngIf="cartProductsArray" id="paymentBtn" (click)="onCheckout()">Checkout</button>
      </div>

    </div>

  </div>

  <div class="partOfView2">
  <div class="inside2">
    <div>
      <button>All</button>
    </div>
    <div class="btnDiv" *ngFor="let category of categories">
      <button [id]="category.key">{{ category.name }}</button>
      </div>
      </div>
      <div class="allProducts" >
      <div class="productDiv" *ngFor="let product of products">
  <div>
    <p>Product: {{ product.name }}</p>
    <p>Price: {{ product.price | currency: 'ILS': 'symbol-narrow'}}</p>
    <div class="imgDiv">
    <img [src]="product.img" alt="{{ product.name }} image">
    </div>
    <div>
    <button [id]="product.key" (click)="addToCart($event)">Add to Cart</button>
    <input type="number" id="amount{{product.key}}">
    </div>
  </div>
</div>
 </div>
  
    
  </div>
  </div>



  </div>
`,
  styles: [
    'p{ font-weight: bold !important}',
    '.registerBtn{ margin-top: 5vh !important}',
    '.cartProducts{ overflow-y: auto !important; height: 54vh !important}',
    'img {max-width: 100% !important; max-height: 100% !important}',
    '.imgDiv {height: 29vh !important; width: 31vw !important; border-radius: 10px !important; align-items: center !important; width: 100px;height: 100px !important}',
    '.cartPro{border: 1px solid black !important; width: 28vw !important; border-radius: 10px !important}',
    'h1 {text-align: center !important}',
    'h2 {margin-left: 5vw !important}',
    '.inside1{background-color: white !important; height: 70vh !important; width: 30vw !important; border-radius: 25px !important}',
    '.storeConDiv {display: flex !important}',
    '.allProducts{display: flex !important; flex-wrap: wrap !important; justify-content: center !important; max-width: 100% !important}',
    '.catProducts{display: flex !important; flex-wrap: wrap !important; justify-content: center !important; max-width: 100% !important;}',
    '.productDiv {width: 200px;height: 250px;margin: 5px;padding: 10px;box-sizing: border-box;background-color: #f9f9f9;border: 1px solid black ;border-radius: 5px;}',
    '.partOfView1 {display: flex !important; justify-content: center !important;align-items: center !important; background-color: aquamarine !important; align-items: center !important; margin: 5px !important; height: 85vh !important; width: 32vw !important; border-radius: 25px !important}',
    '.partOfView2 {overflow-y: auto !important; background-color: aquamarine !important; align-items: center !important; margin: 5px !important; height: 85vh !important; width: 64vw !important; border-radius: 25px !important}',
    '.navBarDiv {background-color: aquamarine !important; align-items: center !important; margin: 5px !important; height: 10vh !important; width: 96vw !important; border-radius: 25px !important}',
    '.inside2 {display: flex !important; background-color: aquamarine !important; align-items: center !important; margin: 5px !important; height: 10vh !important; width: 63vw !important; border-radius: 25px !important; border-style: solid !important; border-color: black !important}'
  ]
})
export class InsideTheStoreComponent implements OnInit{
  
  data1: any
  items!: any[];
  categories!: any[]
  products!: any[];
  cookieData: any;
  cookieDataEmail: any;
  user!: any[];
  name: any;
  addCartData: any;
  errorMsg: any;
  newUserData: any;
  cookieDataToken: any;
  cartKey: any;
  some: any;
  someData: any;
  userCart!: any[];

  cartProductsArray!: any[]
  totalSum: any;
  
  checkoutData!: any[];
  
  constructor(private postData: PostData, private route: ActivatedRoute, private authGuardService2: AuthGuardService,
    private http: HttpClient, private elRef: ElementRef, private router: Router,
    private cookieService: CookieService, private putData: PutData,) { }


  ngOnInit() {
    // gets categories
    this.http.get<any[]>('api/categories').subscribe(data => {
      this.categories = data.slice();
    });
    // gets products to show
    this.http.get<any[]>('api/products').subscribe(data => {
      this.products = data.slice();
    });

// gets cookie data including email and access token
    const jsonData = this.cookieService.get('myCookie');
    if(jsonData){
    this.cookieData = JSON.parse(jsonData);
    this.cookieDataEmail = this.cookieData.email
    this.cookieDataToken = this.cookieData.accessToken
    }

    // gets user information including cart Key (cart Id)
    this.http.get<any[]>(`api/users/email/${this.cookieDataEmail}`).subscribe(data => {
      this.user = data.slice();
      this.name = this.user[0].firstName
      this.cartKey = this.user[0].cartKey
      console.log(this.cartKey)
    });

    setTimeout(() => {
      this.getCartInfo(this.cartKey);
    }, 1000);


  }


// add item to cart, in case the user does not have a cart it will create a new cart for the user
  addToCart(event: any) {
    const buttonId = event.target.id;
    const amountValue = this.elRef.nativeElement.querySelector(`#amount${buttonId}`).value;
    // gets the user profile and checks the cart number assigned to him
    this.http.get<any[]>(`api/users/email/${this.cookieDataEmail}`).subscribe(data => {
      this.user = data.slice();
      this.name = this.user[0].firstName
    });

    if(amountValue>=1){
      const cartItem = {
        "products": [
                    {
                        "proKey": buttonId,
                        "amount": amountValue
                    }
        ]
        }
    


    if(!this.user[0].cartKey){
      this.postData.postData('carts/add', cartItem, this.cookieDataToken).subscribe({
        next: (data) => {
          this.addCartData = data
    // update user with the new cart number and adds it to the user profile.  
          
        const cartUpdate = {
          "id": this.user[0].id,
          "cartKey": this.addCartData.key
        }

        this.putData.putData('users', cartUpdate, this.cookieDataToken).subscribe({
          next: (data) => {
            this.someData = data
            this.cartKey = this.someData.cartKey
            console.log(this.cartKey)
          },
          error: (error) => {this.errorMsg = error.message
            console.log(this.errorMsg)
            }
          })


      },
        error: (error) => {this.errorMsg = error.message
        console.log(this.errorMsg)
        },
      });

    }else{
        
      const cartProductUpdate = {
          "key": this.user[0].cartKey,
          "proKey": buttonId,
          "amount": amountValue
      }
      console.log(cartProductUpdate)
      console.log(this.cookieDataToken)


      this.http.put(`api/carts/item`, cartProductUpdate).subscribe(response => {
  console.log(response);
  this.getCartInfo(this.cartKey);
        });
    }

  }
  }

  // gets cart information including products
  getCartInfo(key: any){
  
    if(key) {
  this.http.get<any[]>(`api/carts/key/${key}`).subscribe(data => {
    this.userCart = data.slice();
    const prods =this.userCart[0].products
    const prodsArray: any[] = []
    this.totalSum = 0
    for(const prod of prods){
      
      this.http.get<any[]>(`api/products/key/${prod.proKey}`).subscribe(data => {
        const pro = data.slice();
        const pro1 = {
          name: pro[0].name,
          price: pro[0].price,
          amount: prod.amount,
          key: prod.proKey
        }
        prodsArray.push(pro1)
        this.totalSum = this.totalSum + ((pro[0].price)*(prod.amount))
      })

    }
   this.cartProductsArray = prodsArray
  });

    }

}

// removes item from cart when the remove button is pressed
removeItem(event: MouseEvent) {
    const buttonId = (event.target as HTMLButtonElement).id;
    const keyToRemove = +(buttonId.substring(6));
    console.log(this.user[0].cartKey)

    const cartProductUpdate = {
      "key": this.user[0].cartKey,
      "proKey": keyToRemove,
      "amount": 0
  }


  this.http.put(`api/carts/item`, cartProductUpdate).subscribe(response => {
    console.log(response);
    this.getCartInfo(this.cartKey);
          });

  }


// redirects to the checkout page when the checkout button is pressed
  onCheckout() {
  const dataArray = this.cartProductsArray

  
  const jsonData2 = JSON.stringify(this.cartProductsArray);
  this.cookieService.set('checkout', jsonData2)
  this.authGuardService2.setRequiredRoles(['user']);   
  this.router.navigate(['/checkout']);                                       
   
  }

}

