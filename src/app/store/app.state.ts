import { CounterState } from "../CounterModule/state/counter.state";
import { PostsState } from "../posts/state/posts.state";
import { counterReducer } from "../CounterModule/state/counter.reducer";
import { postsReducer } from "../posts/state/posts.reducers";


export interface AppState {
    counter: CounterState,
    posts: PostsState
}

export const appReducer = {
    counter: counterReducer,
    posts: postsReducer
}