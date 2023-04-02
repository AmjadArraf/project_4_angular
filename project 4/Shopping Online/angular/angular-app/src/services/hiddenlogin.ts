import { Injectable } from '@angular/core';

// authentication guard needed to prevent access that is not allowed to the store front route
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  private requiredRoles!: string[];

  setRequiredRoles(requiredRoles: string[]): void {
    this.requiredRoles = requiredRoles;
  }

  getRequiredRoles(): string[] {
    return this.requiredRoles;
  }
}