import { createReducer, on } from '@ngrx/store';
import { initialState } from './counter.state';
import { changeTopic, customIncrement, decrement, increment, reset } from './counter.actions';

const _counterReducer = createReducer(
    initialState,
    on(increment, (state) => {
        return {
            ...state,
            counter: state.counter + 1,
        };
    }),
    on(decrement, (state) => {
        return {
            ...state,
            counter: state.counter - 1,
        };
    }),
    on(reset, (state) => {
        return {
            ...state,
            counter: 0,
        };
    }),
    on(customIncrement, (state, action) => {
        console.log(action);
        return {
            ...state,
            counter: state.counter + +action.count
        }
    }),
    on(changeTopic, (state) => {
        return {
            ...state,
            topic: 'Modified state management'
        }
    })
)

export function counterReducer(state: any, action: any) {
    return _counterReducer(state, action);
}