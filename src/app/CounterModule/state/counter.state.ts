export interface CounterState{
    counter: number,
    topic: string
}

export const initialState: CounterState = {
    counter: 4,
    topic: 'state management'
}