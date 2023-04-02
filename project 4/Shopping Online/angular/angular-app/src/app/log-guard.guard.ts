import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuardService } from 'src/services/hiddenlogin';

@Injectable({
  providedIn: 'root'
})
export class LogGuardGuard implements CanActivate {
  constructor(private router: Router, private authGuardService: AuthGuardService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const requiredRoles = this.authGuardService.getRequiredRoles();
      if(requiredRoles[0]==='user'){
        return true;
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
  }
  
}
