import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { getPostById, getPosts } from '../state/posts.selector';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { updatePost } from '../state/posts.actions';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, OnDestroy {

  post: Post;
  postForm: FormGroup;
  postSubscription: Subscription;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.createForm();
    this.postSubscription = this.store.select(getPostById).subscribe((post) => {
      if (post) {
        this.post = post;
        this.postForm.patchValue({
          title: post.title,
          description: post.description
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  createForm() {
    this.postForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ])
    })
  }

  onUpdatePost() {
    if (!this.postForm.valid) {
      return;
    }
    const title = this.title.value;
    const description = this.description.value;

    const post: Post = {
      id: this.post.id,
      title: title,
      description: description
    };
    this.store.dispatch(setLoadingSpinner({ status: true }));
    this.store.dispatch(updatePost({ post }));
  }

  showDescriptionErrors() {
    if (this.description.touched && !this.description.valid) {
      if (this.description.errors.required) {
        return 'Description is required.';
      }
      if (this.description.errors.minlength) {
        return 'Description should be of 10 charecters.';
      }
    }
  }

  get title() {
    return this.postForm.get('title');
  }

  get description() {
    return this.postForm.get('description');
  }

}
