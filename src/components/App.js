import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Switch, Route } from 'react-router-dom';

import AnimeGrid from 'containers/AnimeGrid';
import AnimeSinglePage from 'containers/AnimeSinglePage';

import 'index.css';

const todo = ( state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      }
      break;
    case 'TOOGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed,
      }
      break;
    default:
      return state;
      break;
  }

};

const todos = ( state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo ( undefined, action),
      ];
      break;
    case 'TOOGLE_TODO':
      return state.map( t => todo(t, action));
      break;
    default:
      return state;
      break;
  }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
      break;

    default:
      return state;
      break;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

let todoID = 0;

const TodoApp = props => (
  <div>
    <input 
    ref={node => {
      this.input = node;  
    }}
    type="text" />
    <button 
    onClick= {()=>{
      store.dispatch({
        type: 'ADD_TODO',
        text: this.input.value,
        id: todoID++
      });
      this.input.value = '';
    }}> Add Todo</button>
    <ul>
      {props.todos.map( (todo) =>{
        return (
          <li
            key={todo.id} 
            onClick={() => {
              store.dispatch({
                type: 'TOOGLE_TODO',
                id: todo.id,
              });
            }}
            style={{textDecoration: todo.completed ? 'line-through' : ''}}>
            {todo.text}
          </li>
        );
      })}
    </ul>
  </div>
);

const renderTest = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos}/>,
    document.getElementById('redux')
  );
}

store.subscribe(renderTest);

renderTest();

const AnimeGridRender = props => <AnimeGrid {...props} infiniteScroll />;

const App = () => (
  <MuiThemeProvider>
    <Switch>
      <Route exact path="/" render={AnimeGridRender} />
      <Route path="/anime/:id" component={AnimeSinglePage} />
      <Route exact path="/redux" render={()=> <h1 style={{marginBottom: '10px'}}> Redux Page </h1>} />
    </Switch>
  </MuiThemeProvider>
);

export default App;
