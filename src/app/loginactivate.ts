import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Injectable()
export class LoginActivate implements CanActivate {
  constructor(
    private dataService: DataService,
    private router: Router,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.dataService.isLoggedIn() && this.dataService.isInitialized()) {
      const path = route.url.map(u => u.path);
      localStorage.setItem(this.dataService.LOGIN_REDIR, this.dataService.EncodeObject(path));
      this.router.navigate(['login']);
    }
    return true;
  }
}
