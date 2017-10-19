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

const todos = (state = [], action) => {
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

const getVisibleTodos = (todos, filter) => {
  console.log(filter);
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
      break;
    case 'SHOW_ACTIVE':
      return todos.filter( todo => !todo.completed)
      break;
    case 'SHOW_COMPLETED':
      return todos.filter( todo => todo.completed)
      break;
    default:
      return todos;
      break;
  }
};

const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{textDecoration: completed ? 'line-through' : ''}}>
    {text}
  </li>
);

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map (todo =>
       <Todo 
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
       />
    )}
  </ul>
);

const FilterLink = ({filter, children, currentFilter, onClick}) => {

  if (currentFilter === filter) {
    return children;
  }

  return (
    <a href='#'
    onClick={e => {
      e.preventDefault();
      onClick(filter);
    }}>
      {children}
    </a>
  );
}

const AddTodo = ({ onAddClik }) => {
  let input;
  return (
    <div>
    <input 
      ref={node => {
        input = node;  
      }}/>

      <button 
      onClick= {()=>{
        onAddClik(input.value);
        input.value = '';
      }}> Add Todo</button>
    </div>
  )
}
const Footer = ({visibilityFilter, onFilterClick}) => {
  
  return (
    <p>
      Show:
      {' '}
      <FilterLink
        filter='SHOW_ALL'
        currentFilter={visibilityFilter}
        onClick = {onFilterClick}
      >
        All
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_ACTIVE'
        currentFilter={visibilityFilter}
        onClick = {onFilterClick}
      >
        Active
      </FilterLink>

      {' '}
      <FilterLink
        filter='SHOW_COMPLETED'
        currentFilter={visibilityFilter}
        onClick = {onFilterClick}
      >
        Completed
      </FilterLink>
    </p>
  )
}
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

let nextTodoID = 0;

const TodoApp = ({ todos, visibilityFilter}) => (
  <div>
    <AddTodo 
      onAddClik = {text => 
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoID++,
          text
        })
      }
    />   
    <TodoList
    todos={
      getVisibleTodos(todos, visibilityFilter)
    }
    onTodoClick={id => 
        store.dispatch({
          type: 'TOOGLE_TODO',
          id: id,
      })
    }
    />
    <Footer 
    visibilityFilter = {visibilityFilter}
    onFilterClick={filter=> 
      store.dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter,
      })
    }

    />
  </div>
);
const renderTest = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()}/>,
    document.getElementById('redux')
  );
}

const store = createStore(todoApp);

store.subscribe(renderTest);

renderTest();

console.log(store.getState());


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
