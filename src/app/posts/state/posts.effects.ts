import { Injectable } from "@angular/core";
import { Actions, act, createEffect, ofType } from "@ngrx/effects";
import { PostsService } from "src/app/services/posts.service";
import { addPosts, addPostSuccess, deletePost, deletePostSuccess, loadPosts, loadPostsSuccess, updatePost, updatePostSuccess } from "./posts.actions";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";
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
                        return addPostSuccess({ post, redirect: true });
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
                        return updatePostSuccess({ post: action.post });
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
    })
    
    postRedirect$ = createEffect(() => {
        return this.action$.pipe(
            ofType(addPostSuccess),
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