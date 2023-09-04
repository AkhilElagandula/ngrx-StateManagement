import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { PostsService } from "src/app/services/posts.service";
import { LOAD_POSTS, loadPosts, loadPostsSuccess } from "./posts.actions";
import { map, mergeMap } from "rxjs/operators";

@Injectable()
export class PostsEffects {
    constructor(
        private action$: Actions,
        private postService: PostsService
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
}