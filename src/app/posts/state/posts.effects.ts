import { Injectable } from "@angular/core";
import { Actions, act, createEffect, ofType } from "@ngrx/effects";
import { PostsService } from "src/app/services/posts.service";
import { addPosts, addPostSuccess, deletePost, deletePostSuccess, loadPosts, loadPostsSuccess, updatePost, updatePostSuccess } from "./posts.actions";
import { catchError, filter, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AppState } from "src/app/store/app.state";
import { Store } from "@ngrx/store";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.actions";
import { of } from "rxjs";
import { ROUTER_NAVIGATION, RouterNavigatedAction } from "@ngrx/router-store";

@Injectable()
export class PostsEffects {
    constructor(
        private action$: Actions,
        private postService: PostsService,
        private router: Router,
        private store: Store<AppState>
    ) { }

    loadPosts$ = createEffect(() => {
        return this.action$.pipe(
            ofType(loadPosts),
            mergeMap(data => {
                return this.postService.getPosts().pipe(
                    map(data => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        return loadPostsSuccess({ posts: data });
                    })
                );
            })
        );
    });

    addPosts$ = createEffect(() => {
        return this.action$.pipe(
            ofType(addPosts),
            mergeMap((action) => {
                return this.postService.addPosts(action.post).pipe(
                    map((data) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        const post = { ...action.post, id: data.name };
                        return addPostSuccess({ post, redirect: true });
                    }),
                    catchError(errorResp => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        const error = this.postService.getErrorMessage(
                            errorResp.error.error.message
                        );
                        return of(setErrorMessage({ message: error }));
                    })
                );
            })
        );
    });

    updatePost$ = createEffect(() => {
        return this.action$.pipe(
            ofType(updatePost),
            switchMap((action) => {
                return this.postService.updatePosts(action.post).pipe(
                    map((data) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        return updatePostSuccess({ post: action.post, redirect: true });
                    }),
                    catchError(errorResp => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        const error = this.postService.getErrorMessage(
                            errorResp.error.error.message
                        );
                        return of(setErrorMessage({ message: error }));
                    })
                );
            })
        );
    });

    deletePost$ = createEffect(() => {
        return this.action$.pipe(
            ofType(deletePost),
            switchMap((action) => {
                return this.postService.deletePost(action.id).pipe(
                    map((data) => {
                        return deletePostSuccess({ id: action.id })
                    })
                );
            })
        );
    });

    postRedirect$ = createEffect(() => {
        return this.action$.pipe(
            ofType(...[addPostSuccess, updatePostSuccess]),
            tap((action) => {
                if (action.redirect) {
                    this.router.navigate(['posts']);
                }
            })
        );
    },
        { dispatch: false }
    );

    getSinglePost$ = createEffect(() => {
        return this.action$.pipe(
            ofType(ROUTER_NAVIGATION),
            filter((r: RouterNavigatedAction) => {
                return r.payload.routerState.url.startsWith('/posts/details');
            }),
            map((r: RouterNavigatedAction<any>) => {
                return r.payload.routerState['params']['id'];
            }),
            switchMap((id) => {
                return this.postService.getPostById(id).pipe(
                    map((post) => {
                        const postData = [{ ...post, id }];
                        return loadPostsSuccess({ posts: postData });
                    })
                );
            })
        );
    });
}