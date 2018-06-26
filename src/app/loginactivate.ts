import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Injectable()
export class LoginActivate implements CanActivate {
  constructor(private dataService: DataService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.dataService.loggedIn && this.dataService.isInitialized()) {
        this.router.navigate(['login']);
    }
    return true;
  }
}
