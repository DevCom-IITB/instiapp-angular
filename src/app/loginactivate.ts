import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LoginActivate implements CanActivate {
  constructor(
    private dataService: DataService,
    private router: Router,
    private cookieService: CookieService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.dataService.isLoggedIn() && this.dataService.isInitialized()) {
      const path = route.url.map(u => u.path);
      this.cookieService.set('loginredir', this.dataService.EncodeObject(path));
      this.router.navigate(['login']);
    }
    return true;
  }
}
