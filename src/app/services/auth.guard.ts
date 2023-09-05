import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.state";
import { isAuthenticated } from "../auth/state/auth.selector";
import { map } from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select(isAuthenticated).pipe(
            map((authenticated) => {
                if (!authenticated) {
                    return this.router.createUrlTree(['auth']);
                }
                return true;
            })
        );
    }
}