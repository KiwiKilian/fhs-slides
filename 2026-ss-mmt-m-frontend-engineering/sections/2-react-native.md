---
layout: section
hideInToc: false
---

# React Native

## Learn once, write anywhere.

---

# Hybrid Apps

- Apps from one codebase which compile to multiple targets
  - Android
  - iOS
  - Web
  - Windows
  - macOS
  - ...
- Faster development through writing less code 👍

---

# Hybrid Apps: PWA Approach

- Progressive Web App wrapped into a webview (=browser) of a native app
- Use any known frontend web technology 👍
- Access to native code through bridges (foreign function interface) 👍
- Often don't feel "native" 👎
- Performance limitations 👎
- Weird approaches like a native view behind the webview 👎
- Frameworks:
  - PhoneGap/Cordova
  - Ionic

---

# Hybrid Apps: Native UI

- Platform specifics abstracted to a unified interface
- App logic and interface can be written in a single language
- Native UI elements 👍
- Access to native code through bridges (foreign function interface) or similar 👍
- Dependency to framework between your app and native platform 👎
- It's still an app bend to multiple platforms `¯\_(ツ)_/¯`
- Frameworks:
  - .NET MAUI
  - Flutter
  - React Native

---
layout: quote
---

# React Native allows developers who know React to create native apps. At the same time, native developers can use React Native to gain parity between native platforms by writing common features once.

[reactnative.dev](https://reactnative.dev/docs/environment-setup)

---

# React Native Basics

- Framework from Facebook/Meta
- First released 2015
- Write logic in JavaScript which will be run on each platform
- Define your UI in JSX syntax
  - RN instead of manipulating a browser DOM will create and update native UI elements for you
- Build your app completely or partially using React
  - Mix with native screens with React Native screens
  - Integrate with brown field apps

---

# Hermes

> In most cases, React Native will use Hermes, an open-source JavaScript engine optimized for React Native
> [^1]

<br />

> Hermes plans to target ECMAScript 2015 (ES6), with some carefully considered exceptions
> [^2]

<br />

- ECMAScript 2015 (ES6), with some carefully considered exceptions
- Browser polyfills
  - CommonJS `require`
  - `console`.\{`log`, `warn`, `error`, `info`, `debug`, `trace`, `table`, `group`, `groupCollapsed`, `groupEnd`}
  - `XMLHttpRequest`, `fetch`
  - \{`set`, `clear`}\{`Timeout`, `Interval`, `Immediate`}, \{`request`, `cancel`}`AnimationFrame`

<!-- Footer -->

[^1]: https://reactnative.dev/docs/javascript-environment

[^2]: https://hermesengine.dev/docs/language-features

---

# [New Architecture](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)

- Complete rewrite of the major systems that underpin React Native
  - Component rendering
  - Communication between JS and Native
  - Work scheduling across different threads
- Old architecture
  - Only allowed asynchronous native interactions
  - Required serialization for data exchange through bridge
- Full support of modern React features
  - Suspense
  - Transitions
- Type-safety between JS and native code
- Comes with many performance improvements
- Released at the end of 2024

---

# Elements

There is a basic of elements available, which could be translated like this (incomplete, not conclusive):

| React Native     | HTML                             |                                                                 |
| ---------------- | -------------------------------- | --------------------------------------------------------------- |
| `<View />`       | `<div />`                        |                                                                 |
| `<Text />`       | `<p />`                          | Rendering text outside of<br/>`Text` will break compilation 💥. |
| `<Image />`      | `<img />`                        |                                                                 |
| `<TextInput />`  | `<input />`                      |                                                                 |
| `<ScrollView />` | `<div style="overflow: auto" />` | But with virtualization added ✨.                               |

https://reactnative.dev/docs/components-and-apis

---
class: text-center
---

# Mapping to native UI Elements

<img src="/assets/react-native-diagram.svg" class="m-auto" style="max-height: 380px"/>

https://reactnative.dev/docs/intro-react-native-components

---
layout: two-cols
---

# Styling & Layout

- Only supports a subset of CSS
- Styles are written as objects with style names written in camel-case
- Limited cascade
- Common basics like `margin`, `padding`, `border`, `color`, `backgroundColor`...
- Some restricted to specific elements (as only `Text` can handle text)
- `position: relative | absolute`)
- Flex Layout only (via engine called yoga) (`display: none | flex`)

::right::

<img src="/assets/react-native-styles.png" class="mt-10 p-5" style="width: auto; object-fit: contain" />

---

# Which libraries can be used in RN?

- UI Libraries/Components for the web <v-click>❌</v-click>
  - MUI, Spectrum...
- CSS Frameworks <v-click>❌</v-click>
  - shadcn/ui, Bootstrap, Tailwind... <v-click>(some have native pendants)</v-click>
- Anything headless for React <v-click>✅</v-click>
  - TanStack Query/Table, Apollo, zustand, Redux...
- Any plain logic JS library <v-click>✅</v-click>
  - lodash, Turf.js, currency.js...

---

# Why choose React Native?

- Easy transition when already familiar with React
  - Easy to build a combined team of web and app developers
  - Can transfer many patterns from web to native and other way around
- Shared code, faster development
- Hot reloading, faster development
- Large ecosystem of native plugins/libraries which solve most native problems (which me, as a web developer, doesn't want to touch myself 🫠)

---
layout: iframe
url: https://reactnative.dev/showcase
---

---

# Structure

```
my-app/
│-- android/      # Native Android code
│-- ios/          # Native iOS code
│-- src/          # JS/TS code
│-- assets/       # Images, fonts, etc.
│-- index.js      # Entry point
```

- `android`/`ios` directories contain each a native project
- `src` has the shared React code

## Config files

- `app.json` – App metadata
- `babel.config.js` – Babel setup
- `metro.config.js` – Bundler config
- `.gitignore` – Ignore files in Git

---
transition: slide-left
---

# Setup a bare React Native Project[^1]

- Node.js
- Watchman
- Xcode (requires macOS)
  - Simulator
  - Cocoapods
- Android Studio
  - Java Development Kit
  - Android SDK, Emulator

Creating your project:

```bash
npx @react-native-community/cli@latest init
```

<!-- Footer -->

[^1]: https://reactnative.dev/docs/set-up-your-environment
