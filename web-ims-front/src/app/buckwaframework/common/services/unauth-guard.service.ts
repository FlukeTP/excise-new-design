import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class UnauthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): Promise<boolean> | boolean {
    if (this.authService.getLogin() && this.authService.getUser().username) {
      return false;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    return true;

  }
}
