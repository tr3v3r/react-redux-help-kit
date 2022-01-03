# react-redux-help-kit
React + Redux utils to improve Development Experience.

# Installation

```sh
npm install react-redux-help-kit
```

or

```sh
yarn add react-redux-help-kit
```

# Usage

## Async helpers
Set of hooks and rules to easily control loading, error and success state of async call.

Add `asyncReducers` to your combineReducers function
```javascript
import { combineReducers } from 'redux'
import { asyncReducers } from 'react-redux-help-kit'

const rootReducer = combineReducers({
    ...asyncReducers,
    // your others reducers
})
```

That's it!

From now to have loading, error or success states of async actions you need to follow simple **_REQUEST**, **_SUCCESS**, **_FAILURE** rule while creating acions.

Example: 
```javascript

// actions.ts

export const FETCH_TODO_DATA_REQUEST = 'FETCH_TODO_DATA_REQUEST';
export const FETCH_TODO_DATA_SUCCESS = 'FETCH_TODO_DATA_SUCCESS';
export const FETCH_TODO_DATA_FAILURE = 'FETCH_TODO_DATA_FAILURE';



export const FETCH_USER_DATA_REQUEST = 'FETCH_USER_DATA_REQUEST';
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS';
export const FETCH_USER_DATA_FAILURE = 'FETCH_USER_DATA_FAILURE';
```
```javascript
// middleware.ts

import { fetchTodos } from 'api'

export export const fetchTodoMiddleware = store => next => async action => {
    if(action.type === FETCH_TODO_DATA_REQUEST) {
        try {
            const data = await fetchTodos() 
            store.dispatch({ type: FETCH_TODO_DATA_SUCCESS, payload: data })
        } catch (e) {
            store.dispatch({ type: FETCH_TODO_DATA_FAILURE, payload: e })
        }
    }

    next(action)
}
```
```javascript
// TodoListComponent.tsx
import { useRequestLoading, useRequestError } from 'react-redux-help-kit';

import { FETCH_TODO_DATA_REQUEST, FETCH_USER_DATA_REQUEST } from './actions';

export const TodoListComponent = () => {
    // loading status will be updated accordinly to success or failure of request
    const { loading } = useRequestLoading(FETCH_TODO_DATA_REQUEST); 
    const { loading: userRequestLoading } = useRequestLoading(FETCH_USER_DATA_REQUEST); 

    // if error you can handle it
    const { error, clearError } = useRequestError(FETCH_TODO_DATA_REQUEST); 
    const { error: userRequestError } = useRequestError(FETCH_USER_DATA_REQUEST); 

    useEffect(() => {
        if(error) {
            // notify user or do something with error
            clearError()
        }
    }, [error])

    useRequestError(FETCH_TODO_DATA_REQUEST, () => {
        // this callback will be called if fetching todos was successful
    });

    return // JSX
}

```

To change **error** type you can re-assign it locally:

```javascript
const { error } = useRequestError<ICustomError>( /* action */ ); 
```
Or globally:

```javascript
// create src/@types/react-redux-help-kit/index.d.ts

import 'react-redux-help-kit';
import {Action} from 'react-redux-help-kit';

declare module 'react-redux-help-kit' {
  export function useRequestError<T extends ICustomError>(
    action: Action,
  ): {
    error: T | null;
    clearError: () => void;
  };
}

```








