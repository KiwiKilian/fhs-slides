---
layout: section
hideInToc: false
---

# Creating a Stack for React (Native) Projects

## Architectural decisions from the real world

---
layout: quote
---

# If the only tool you have is a hammer, it is tempting to treat everything as if it were a nail.

Maslow's Hammer – Abraham Maslow, 1966

---

# React, really?

Analyse your problem space to apply the best available tools to maximize experience for your users. Think critically, is this website in need of a client-heavy JavaScript framework?

- If yes:
  - Look into SSR, SSG, Streaming etc. &rarr; Most meta frameworks have you covered
  - Keep the client-footprint low where possible
- If no:
  - Use only for static generation
  - Look for SSG alternatives

---

# React (SPA) and React Native shared problems

- 🌎 Current location in the app &rarr; URL
  - Think of React Native like a browser without the URL-bar
- ⌨️ Managing and persisting user inputs
- 📤 Fetching and mutating Data

---

# Why build your own Stack?

- Many of these problems will be solved by meta frameworks
- But React SPAs and React Native are a bit different
  - &rarr; Not much meta frameworks to choose from
  - You can mix and match your tools more easily how you like it
- By creating your own stack, reusable in different projects, you gain a lot of synergies
  - Even greater if the same team works on React SPAs and React Native

---
layout: center
---

# Routing

---

# Why do we need a Router in a React SPA? 🌎

- For a static website, every URL requests a different document on the server
- A SPA only ever requests a single HTML file from the browser
- Now the application has to keep track of the user location
- A router can update the URL on the client for you and match routes the other way around
- Try to keep the state in the URL, just like you would with a non SPA setup
  - With a MVC for example a table filter would have been passed as URL search params<br/>`?location=FH Salzburg`
  - Keep those patterns with a SPA, to allow sharing or saving a bookmark

---

# React SPA Routers

A SPA needs client side routing, most popular solutions:

- [React Router](https://reactrouter.com/en/main)
  - Most versatile for complex applications
  - File based only with Remix
  - Not Typesafe without additional tools
- [TanStack Router](https://tanstack.com/router/latest)
  - File Based
  - Typesafe
  - Quite new

---

# Why is a Router necessary in React Native? 📱

<v-clicks>

- Apps also have multiple screens &rarr; Where is my user currently?
- Apps can be linked from websites
  - (Do you want to watch this video in our app?)
  - Follows the URI/URL patterns
    - Universal Links
      - Share content from app (can be viewed on website or app)
      - Associate a domain with your app
      - iOS will show the associated app from the App Store in Safari
    - Custom Scheme
      - `exampleapp://`
      - Less secure
        - Any app can register for any scheme
        - If multiple apps for scheme available, iOS chooses one randomly

</v-clicks>

---

# React Native Routers

- [React Navigation](https://reactnavigation.org/) (don't confuse with "React Native Navigation")
  - Uses native navigation elements
  - Brings all you need for creating different types of navigations
- [Expo Router](https://docs.expo.dev/router/introduction/)
  - File based routes
  - Typesafe routes
  - Get universal links out of the box
  - Build upon React Navigation
  - Generally great integration into Expo

---
layout: center
---

# State Management

---

# Where is our State?

- On the server
  - Database
  - Session storage
- On the client
  - LocalStorage
  - SessionStorage
  - IndexDB
  - In memory
- In between client and server
  - URL &rarr; handled by the previous section
  - Cookies

In React we need reactivity of our state to respond to changes.

---

## The most basic state in React

If it's a client state in React, not applicable for the URL, our most basic approach is `useState`:

```tsx
const [currentLocation, setCurrentLocation] = useState<RouteFeature>();

return (
  <>
    <p>Your current route: {route.properties.name}</p>

    <RouteOriginInput route={route} />
    <RouteDestinationInput route={route} />
    <RouteMap route={route} />
    <StartNavigationButton route={route} />
  </>
);
```

What problem do you might see?

---
layout: two-cols
---

# Prop Drilling

<v-clicks>

- `useState` must be in the highest common component
- Passes state and setter down to (multiple levels of) children
- Feels redundant
- Might go through components which don't use it themselves
- Harder to refactor

</v-clicks>

::right::

<img src="/assets/react-prop-drilling.webp" class="m-auto mt-16" style="max-height: 160px"/>
<div class="text-right">

[^1]

</div>

<!-- Footer -->

[^1]: https://react.dev/learn/passing-data-deeply-with-context

---
layout: two-cols
---

# Context

- React built-in solution to passing down a state from a parent through a provider
- Access possible in all child components
- Produces a lot of boilerplate code

```tsx
function Parent() {
  return (
    <TasksProvider>
      <Children />
    </TasksProvider>
  );
}

function Children() {
  const tasks = useTasks();

  return <p>You have {tasks.length} tasks</p>;
}
```

::right::

```ts {all|3-5|7-20|22-28|30-55}{maxHeight:'100%'}
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    []
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

https://react.dev/learn/scaling-up-with-reducer-and-context

---

# Alternatives?

<Tweet id="1759803449418629232" scale="0.75" />

---

# `zustand`

```ts {1|3|5-13|15-31}{maxHeight:'100%'}
import { create } from 'zustand';

type Task = { id: number; text: string; done: boolean };

type TasksStoreState = {
  tasks: Task[];

  actions: {
    addTask: (task: Task) => void;
    updateTask: (updatedTask: Task) => void;
    deleteTask: (deletedTask: Task) => void;
  };
};

const useTasksStore = create<TasksStoreState>((set) => ({
  tasks: [],

  actions: {
    addTask: (task) => set(({ tasks }) => ({ tasks: [...tasks, task] })),
    updateTask: (updatedTask) =>
      set(({ tasks }) => ({
        tasks: tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      })),
    deleteTask: (deletedTask) =>
      set(({ tasks }) => ({
        tasks: tasks.filter(({ id }) => id !== deletedTask.id),
      })),
  },
}));
```

---

# Actions[^1]

- Keep all your `actions` (functions modifying your state) in one object
  - They are static and can thus be easily selected

```ts
const { addTask, updateTask } = useTaskStore((state) => state.actions);
```

- Move your business logic into those `actions`
  - Create actual domain tasks e.g. `add`, `update`, `delete`...
- Name your `actions` along your business logic
- Try to avoid plain setters, if possible
- Use other state from same or different store inside your `actions`
- Your actions can also be `async`, call `set` when finished
- Create different stores, for different domains!

<!-- Footer -->

[^1]: https://tkdodo.eu/blog/working-with-zustand

---

# Selecting state

- Make atomic picks

```ts
const tasks = useTasksStore((state) => state.tasks);
```

- If you need multiple fields, make multiple picks
- If you need a combined object leverage `useShallow`

---

# Persisting

- `persist` middleware allows saving the state to different synchronous and asynchronous stores
  - LocalStorage
  - AsyncStorage
  - IndexDB
- Set a `version` in combination with `migrate` to change your persisted store if structure changed
- Use `partialize` to only persist a part of your store (e.g. excluding your `actions`)
  - Will be shallow merged storage with your store state on hydration

With very low effort, a global store is now persisted to a storage of our choice

---
layout: two-cols
---

# Global vs. Context

- Store now is global, not provided via context
- When do we need a store in a context?

<v-click>
&rarr; Complex components (many levels of children) with separate stores
</v-click>

::right::

```ts
import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

const StoreContext = createContext(null)

const StoreProvider = ({ children }) => {
  const storeRef = useRef()
  if (!storeRef.current) {
    storeRef.current = createStore((set) => ({
      // possibility to pass props
    }))
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

const useStoreInContext = (selector) => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('Missing StoreProvider')
  }
  return useStore(store, selector)
}
```

---

# Immutability

Same recommendations as for `useState` apply:

- Avoid mutating
- Create new [objects](https://react.dev/learn/updating-objects-in-state#recap)/[arrays](https://react.dev/learn/updating-arrays-in-state#recap)
- Alternatively use [`immer`](https://github.com/immerjs/immer)

---

# Small, predictable, no magic

- `zustand` is very comprehensible
- Less boilerplate
- Nicely typed
- Highly extensible

---
layout: center
---

# Data Fetching

---

# What's wrong with `fetch` in `useEffect`?[^1]

```ts
const [data, setData] = useState([]);
const [error, setError] = useState();

useEffect(() => {
  fetch(`${endpoint}/${category}`)
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => setError(error));
}, [category]);
```

<v-clicks>

- Race condition
- Loading state
- Empty state
- Reset when dependency changes
- Fires twice in `StrictMode`
- `response.ok`?

</v-clicks>

<!-- Footer -->

[^1]: https://tkdodo.eu/blog/why-you-want-react-query

---

# `@tanstack/react-query` to the Rescue[^1]

- No race condition, state is stored by its input
- Loading, data and error states
- Specify your placeholderData separately
- Previous data will only be supplied if requested
- Request deduplication

&rarr; React Query is an async state manager, not a data fetching library

<!-- Footer -->

[^1]: https://tkdodo.eu/blog/why-you-want-react-query

---

# React Query Keys[^1]

- The `queryKey` is comparable to a `useEffect` dependency array

  - `queryKey` must be unique to the query's data
  - If the `queryKey` changes, the `queryFn` will trigger again (e.g. when the id changes)

    &rarr; If your query function depends on a variable, include it in your query key

  - Can include primitives or objects

- If you just want to reload the same data use `refetch` (returned from `useQuery`)

```tsx
const todoId = 1;
const { data } = useQuery({ queryKey: ['todos', 'details', todoId], queryFn: () => getTodoDetail(todoId) });
```

<!-- Footer -->

[^1]: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys

---

# Organize your Query Keys

```ts
const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

useQuery({
  queryKey: todoKeys.detail(1),
  queryFn: fetchTodo(1),
});

queryClient.invalidateQueries({
  queryKey: todoKeys.details(),
});
```

[^1]

<!-- Footer -->

[^1]: https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories

---

# API type-safety

- How do we get types for our APIs?
  - Available endpoints
  - Request path, params, body
  - Response body
- Manual types are error-prone
- Different approaches available:
  - `tRPC`
  - GraphQL
  - Generating clients from OpenAPI specs

---

# Generate your API Clients

- Build your APIs with [OpenAPI](https://www.openapis.org/) specs
  - Example: https://editor.swagger.io/
  - Wildly available in all common backend languages/frameworks
- Generate API clients for use in TypeScript
- Create `fetch` methods for you
- API contract
  - OpenAPI spec must be strictly matching your actual sent data
  - Can make versioning easier/obsolete
- [`@hey-api/openapi-ts`](https://github.com/hey-api/openapi-ts)
  - React Query plugin
  - Zod plugin
- Many other libraries available
