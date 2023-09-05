import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PostsService } from "src/app/services/posts.service";
import { addPosts, addPostsSuccess, loadPosts, loadPostsSuccess } from "./posts.actions";
import { map, mergeMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class PostsEffects {
    constructor(
        private action$: Actions,
        private postService: PostsService,
        private router: Router
    ) { }

    loadPosts$ = createEffect(() => {
        return this.action$.pipe(
            ofType(loadPosts),
            mergeMap(data => {
                return this.postService.getPosts().pipe(
                    map(data => {
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
                        const post = { ...action.post, id: data.name };
                        return addPostsSuccess({ post, redirect: true });
                    })
                );
            })
        );
    });

    postRedirect$ = createEffect(() => {
        return this.action$.pipe(
            ofType(addPostsSuccess),
            tap((action) => {
                if (action.redirect) {
                    this.router.navigate(['posts']);
                }
            })
        );
    },
        { dispatch: false }
    );
}