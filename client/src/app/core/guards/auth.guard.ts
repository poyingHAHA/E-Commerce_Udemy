import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot, // the route that is attempted to be activated
    state: RouterStateSnapshot): Observable<boolean> {
      // We have the state of the current router states and we could use this to find out where the user is coming from.
      // We can return unobservable of a coolean, a promise of a boolean or just a simple boolean as well as
    return this.accountService.currentUser$.pipe(
      map(auth => {
        if(auth){
          return true;
        }
        // if people are not login
        this.router.navigate(['account/login'], {queryParams: {returnUrl: state.url}});
      })
    );
  }

}
