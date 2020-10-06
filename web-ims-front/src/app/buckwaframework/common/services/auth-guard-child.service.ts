import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardChild implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): Promise<boolean> | boolean {
    if (this.authService.getLogin() && this.authService.getUser().username) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    // this.router.navigate(['/login']);

    //if Refresh F5
    let promise = this.authService.getUserProfile();
    return promise;

    // return true;
  }
}
