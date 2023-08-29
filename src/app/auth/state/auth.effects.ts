import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "src/app/services/auth.service";
import { loginStart, loginSuccess } from "./auth.actions";
import { exhaustMap, map } from 'rxjs/operators';
import { AppState } from "src/app/store/app.state";
import { Store } from "@ngrx/store";
import { setLoadingSpinner } from "src/app/store/shared/shared.actions";

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private store: Store<AppState>
    ) { }

    login$ = createEffect(() => {
        return this.actions$.pipe(ofType(loginStart),
            exhaustMap((action) => {
                return this.authService
                    .login(action.email, action.password)
                    .pipe(map((data) => {
                        this.store.dispatch(setLoadingSpinner({ stats: false }));
                        const user = this.authService.formatUser(data);
                        return loginSuccess({ user });
                    }))
            })
        )
    })
}
