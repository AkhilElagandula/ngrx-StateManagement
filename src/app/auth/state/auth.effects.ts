import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "src/app/services/auth.service";
import { autoLogin, autoLogout, loginStart, loginSuccess, signUpStart, signupSuccess } from "./auth.actions";
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { AppState } from "src/app/store/app.state";
import { Store } from "@ngrx/store";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.actions";
import { of } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private store: Store<AppState>,
        private router: Router
    ) { }

    login$ = createEffect(() => {
        return this.actions$.pipe(ofType(loginStart),
            exhaustMap((action) => {
                return this.authService.login(action.email, action.password).pipe(
                    map((data) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        this.store.dispatch(setErrorMessage({ message: '' }));
                        const user = this.authService.formatUser(data);
                        this.authService.setUserInLocalStorage(user);
                        return loginSuccess({ user, redirect: true });
                    }),
                    catchError(errorResp => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        const errorMessage = this.authService.getErrorMessage(
                            errorResp.error.error.message
                        );
                        return of(setErrorMessage({ message: errorMessage }));
                    })
                );
            })
        );
    });

    loginRedirect$ = createEffect(() => {
        return this.actions$.pipe(ofType(...[loginSuccess, signupSuccess]),
            tap((action) => {
                if (action.redirect) {
                    this.router.navigate(['/']);
                }
            })
        );
    },
        { dispatch: false }
    );

    signUp$ = createEffect(() => {
        return this.actions$.pipe(ofType(signUpStart),
            exhaustMap((action) => {
                return this.authService.signUp(action.email, action.password).pipe(
                    map((data) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        this.store.dispatch(setErrorMessage({ message: '' }));
                        const user = this.authService.formatUser(data);
                        this.authService.setUserInLocalStorage(user);
                        return signupSuccess({ user, redirect: true});
                    }),
                    catchError(errorResp => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        const errorMessage = this.authService.getErrorMessage(
                            errorResp.error.error.message
                        );
                        return of(setErrorMessage({ message: errorMessage }));
                    })
                );
            })
        );
    });

    autoLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(autoLogin),
            mergeMap(action => {
                const user = this.authService.getUserFromLocalStorage();
                return of(loginSuccess({ user, redirect: false}));
            })
        );
    });

    logout$ = createEffect(() => {
        return this.actions$.pipe(ofType(autoLogout),
            map(action => {
                this.authService.logout();
                this.router.navigate(['auth']);
            })
        )
    }, { dispatch: false });
}
