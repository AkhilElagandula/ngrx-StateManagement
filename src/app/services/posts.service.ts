import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Post } from "../models/posts.model";
import { map } from "rxjs/operators";
@Injectable({
    providedIn: 'root'
})

export class PostsService {
    constructor(private http: HttpClient) { }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(
            `https://vue-completecourse.firebaseio.com/posts.json`
        ).pipe(
            map((data) => {
                const posts: Post[] = [];
                for (let key in data) {
                    posts.push({ ...data[key], id: key })
                }
                return posts;
            })
        );
    }

    addPosts(post: Post): Observable<{ name: string }> {
        return this.http.post<{ name: string }>(
            `https://vue-completecourse.firebaseio.com/posts.json`, post
        );
    }

    updatePosts(post: Post) {
        const postData = {
            [post.id]: { title: post.title, description: post.description}
        }
        return this.http.patch(
            `https://vue-completecourse.firebaseio.com/posts.json`, postData
        );
    }

    getPostById(id: string): Observable<Post> {
        return this.http.get<Post>(
            `https://vue-completecourse.firebaseio.com/posts/${id}.json`
        )
    }

    deletePost(id: string) {
        return this.http.delete(
            `https://vue-completecourse.firebaseio.com/posts/${id}.json`
        );
    }

    getErrorMessage(message: string) {
        return message;
    }

}