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

## Maslow's Hammer – Abraham Maslow, 1966

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

# Prop Drilling

- `useState` must be in the highest common component
- Passes state and setter down to (multiple levels of) children



- Feels redundant
- Might go through components which don't use it themself
- Harder to refactor


---

<Tweet id="1759803449418629232" />



---

## Organizing your store

- Keep all your `actions` (functions modifying your state) in one object

---

# `zustand` Example

```ts {all|4|6-9|all}
import { create } from 'zustand';

type Bicycle = { type: 'city' | 'mountain' | 'road' | 'gravel' };

type BicycleStoreState = {
  bicycles: Bicycle[];

  actions: {
    addBicycle: (newBicycle: Bicycle) => void;
    trashBicycles: () => void;
  };
};

const useBicycleStore = create<BicycleStoreState>((set) => ({
  bicycles: [],

  actions: {
    addBicycle: (bicycle) => set(({ bicycles }) => ({ bicycles: [...bicycles, bicycle] })),
    trashBicycles: () => set({ bicycles: [] }),
  },
}));
```

---

## Persisting

- LocalStorage/AsyncStorage
- Versioning
- Partialize

---

# Context

---

## Best practices

Same recommendations as for `useState` apply:

- Avoid mutating
- Create new [objects](https://react.dev/learn/updating-objects-in-state#recap)/[arrays](https://react.dev/learn/updating-arrays-in-state#recap)

- Avoid setters, created reducers
  - Move business logic to your store
  -

---

# Generate your API clients

---

# Use TanStack Query

---
# Organize your Query Keys
--