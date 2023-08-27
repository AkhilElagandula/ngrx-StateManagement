import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPostComponent } from './add-post/add-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsRoutingModule } from './posts.routes';
import { StoreModule } from '@ngrx/store';
import { postsReducer } from './state/posts.reducers';
import { POST_STATE_NAME } from './state/posts.selector';

@NgModule({
  declarations: [
    PostsListComponent,
    AddPostComponent,
    EditPostComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PostsRoutingModule,
    StoreModule.forFeature(POST_STATE_NAME, postsReducer)
  ]
})
export class PostsModule { }
