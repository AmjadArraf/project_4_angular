import { Component, OnInit, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, first, Subscription, firstValueFrom } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DataService } from '../../services/get'
import { PostData } from '../../services/post'
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from 'src/services/hiddenlogin';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main-store',
  template: `<div id="container1">
    <div class="thirdOfView">
      <div *ngIf="showDiv1" class='loginDiv'>
        <div>
      <h2>Already registered?</h2>
    <h2>Login</h2>

    <form (submit)="onLogin()">
  <label>
    Email:
    <input type="email" name="email1" [(ngModel)]="email1">
  </label>
  <br>
  <label>
    Password:
    <input type="text" name="password1" [(ngModel)]="password1">
  </label>
  <br>
  <button type="submit">Submit</button>
  <h2>Not registered?</h2>
  <div class='flexCenter'>
  <button (click)="showDiv1 = false" type="submit">Register</button>
  </div>
</form>
</div>
</div>

<div *ngIf="!showDiv1" class='loginDiv'>
        <div>
      <h2>Register</h2>

    <form (submit)="onRegister()">
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
    Id:
    <input type="text" name="id" [(ngModel)]="id">
  </label>
  <br>
  <label>
    Password:
    <input type="text" name="password" [(ngModel)]="password">
  </label>
  <br>
  <label>
    City:
    <input type="text" name="city" [(ngModel)]="city">
  </label>
  <br>
  <label>
    Street:
    <input type="text" name="street" [(ngModel)]="street">
  </label>
  <br>
  <button type="submit">Submit</button>
  <h2>Already registered?</h2>
  <div class='flexCenter'>
  <button (click)="showDiv1 = true" type="submit">Login</button>
  </div>
</form>
</div>
</div>

    </div>
    
    <div class="thirdOfView"><h2>Why should you by in our store</h2>
    <p>Our store offers the best collection of fresh products,
      a high qality service and a fast delivery system.
    </p>
  </div>
    <div class="thirdOfView">
      <div class="imgDiv">
      <img src="assets/imgs/1234.jpg" alt="supermarket">
      </div>
    </div>
  </div>`,
  styles: [
    '.flexCenter{display: flex; justify-content: center;}',
    '.loginDiv{display: flex; justify-content: center;}',
    'img {height: 30vh; width: 30vw; border-radius: 10px}',
    '.imgDiv {height: 29vh; width: 31vw; border-radius: 10px; align-items: center; margin-top: 5vh; margin-left: 1vw}',
    'h2{text-align: center}',
    'p{text-align: center; margin: 5px}',
    '#container1 {display: flex}',
    '.thirdOfView {background-color: aquamarine; align-items: center; margin: 5px; height: 95vh; width: 32vw; border-radius: 25px}'

  ]
})
export class MainStoreComponent implements OnInit{
  
  email1!: string;
  password1!: string

  email!: string;
  password!: string
  firstName!: string;
  lastName!: string
  id!: number;
  city!: string
  street!: string
  showDiv1: boolean = true;
  apiUrl!: string

  data: any;
  data1: any;
  data2!: {};
  data3!: {};

  verificaionData: any

  cookieData: any

  sentData: any
  loginData: any
  errorMsg: any;
  result: any;

  constructor(private postData: PostData, private router: Router, private authGuardService: AuthGuardService,
     private cookieService: CookieService, private dataService: DataService) { }
  // constructor(private http: HttpClient) {}
  
  // navigateToInsideComponent(data: any) {
  //   this.router.navigate(['/insideStore'], { state: data });
  // }

  ngOnInit() {
    // get cookie data if it exists including access token so the user doesn't have to login again if
    // he logged less that 10 hours ago
    const jsonData = this.cookieService.get('myCookie');
    if(jsonData){
    this.cookieData = JSON.parse(jsonData);
    }
    const cData = this.cookieData
    const token = cData.accessToken
    console.log(cData)
    // verifies the access token, and if verified the user does not have to log again and is redirected to
    // the store front page
    this.postData.postData('users/verify', '', token).subscribe({
      next: (data) => {this.verificaionData = data;
        const res = this.verificaionData
        if(res.response === 'allowed'){
          this.authGuardService.setRequiredRoles(['user']);
          this.router.navigate(['/insideStore']);
        }
    },
      error: (error) => {this.errorMsg = error.message
      console.log(this.errorMsg)
      },
    });


  }



  
  // responsible for sending the login data and if verified the access token will be saved in the cookies
  // and the user will be redirected to the store front page
    onLogin() {
      this.loginData = {
        "email": this.email1,
        "password": this.password1,
      }

      this.postData.postData('users/login', this.loginData, 0).subscribe({
          next: (data) => {this.data1 = data;
            console.log(this.data1)
            this.data2 = {email: this.email1, ...this.data1}
            console.log(this.data2)
            const objectkeys= Object.keys(this.data1);
            for(const key of objectkeys) {
                if(key==='accessToken'){
                  const jsonData2 = JSON.stringify(this.data2);
                  this.cookieService.set('myCookie', jsonData2);
              this.authGuardService.setRequiredRoles(['user']);
              this.router.navigate(['/insideStore']);
                  }
            }
        },
          error: (error) => {this.errorMsg = error.message
          console.log(this.errorMsg)
          },
        });
      }
        
  
// responsible for sending registration data, and if succeeded the access token will be saved in the cookies
// and the user will be redirected to the store front page

    onRegister() {
      this.sentData = {
        "firstName": this.firstName,
        "familyName": this.lastName,
        "email": this.email,
        "id": this.id,
        "password": this.password,
        "city": this.city,
        "street": this.street
      }

      this.postData.postData('users/add', this.sentData, 0).subscribe({
        next: (data) => {this.data = data;
          console.log(this.data)
          this.data3 = {email: this.email, ...this.data}
          console.log(this.data3)
          const objectkeys= Object.keys(this.data);
          for(const key of objectkeys) {
              if(key==='accessToken'){
                const jsonData3 = JSON.stringify(this.data3);
                this.cookieService.set('myCookie', jsonData3);
            this.authGuardService.setRequiredRoles(['user']);
            this.router.navigate(['/insideStore']);
                }
          }
      },
        error: (error) => {this.errorMsg = error.message
        console.log(this.errorMsg)
        },
      });
    }


  }