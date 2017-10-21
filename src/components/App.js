import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
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

const toggleTodo = id => (
  {
    type: 'TOOGLE_TODO',
    id,
  }
);
let nextTodoID = 0;
const addTodo = text => (
  {
    type: 'ADD_TODO',
    id: nextTodoID++,
    text: text
  }
);

const setVisibility = filter => (
  {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  }
);

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

const Link = ({active, children, onClick }) => {

  if (active) {
    return children;
  }

  return (
    <a href='#'
      onClick={e =>{
        onClick()      
        }
      }
    >
      {children}
    </a>
  );
}

const mapStateToLinksProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
const mapDispatchToLinksProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibility(ownProps.filter))
    }
  }
}
const FilterLink = connect(
  mapStateToLinksProps,
  mapDispatchToLinksProps
)(Link);

let AddTodo = ({ dispatch }) => {
  let input;
  
  return (
    <div>
    <input 
      ref={node => {
        input = node;  
      }}/>

      <button 
      onClick= {()=>{
        dispatch(addTodo(input.value))
        input.value = '';
      }}> Add Todo</button>
    </div>
  )
}
AddTodo = connect()(AddTodo);

const Footer = () => {
  
  return (
    <p>
      Show:
      {' '}
      <FilterLink
        filter='SHOW_ALL'
      >
        All
      </FilterLink>
      {', '}
      <FilterLink
        filter='SHOW_ACTIVE'
      >
        Active
      </FilterLink>

      {', '}
      <FilterLink
        filter='SHOW_COMPLETED'
      >
        Completed
      </FilterLink>
    </p>
  )
}

// Standard name `mapStateToProps`
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos, 
      state.visibilityFilter
    )
  };
};
// Standard name `mapDispatchToProps`
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => { 
      dispatch(toggleTodo(id))
    }
  };
};
const VisibiliteTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const TodoApp = () => (
  <div>
    <AddTodo /> 
    <VisibiliteTodoList />
    <Footer />
  </div>
);

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById('redux')
);

// ----------------------------------------------------------------

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
