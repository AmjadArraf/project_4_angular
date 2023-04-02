import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainStoreComponent } from './main-store/main-store.component';
import { InsideTheStoreComponent } from './inside-the-store/inside-the-store.component';
import { LogGuardGuard } from './log-guard.guard'
import { CheckoutComponent } from './checkout/checkout.component';



const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'login', component: MainStoreComponent},
    {path: 'insideStore', component: InsideTheStoreComponent, canActivate: [LogGuardGuard]},
    {path: 'checkout', component: CheckoutComponent},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
