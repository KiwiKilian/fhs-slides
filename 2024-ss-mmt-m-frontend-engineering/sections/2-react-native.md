---
layout: section
hideInToc: false
---

# React Native
## Learn once, write anywhere.

---

# Hybrid Apps

- Apps from one codebase which compile to multiple targets
  - Android, iOS, Web, Windows, macOS...
- Faster development through writing less code 👍

---

# Hybrid Apps: PWA Approach

- Progressive Web App wrapped into a webview (=browser) of a native app
- Use any known frontend web technology 👍
- Access to native code through bridges (foreign function interface) 👍
- Often don't feel "native" 👎
- Performance limitations 👎
- Weird approaches like a native view behind the webview 👎
- Frameworks: PhoneGap/Cordova, Ionic

---

# Hybrid Apps: Native UI

- Platform specifics abstracted to a unified interface
- App logic and interface can be written in a single language
- Native UI elements 👍
- Access to native code through bridges (foreign function interface) or similar 👍
- Dependency to meta framework between your app and native platform 👎
- It's still an app bend to multiple platforms `¯\_(ツ)_/¯`
- Frameworks: .NET MAUI, Flutter, React Native

---

# React Native Basics

- Framework from Facebook/Meta
- First released 2015
- Write logic in JavaScript which will be run on each platform
- Define your UI in JSX syntax
  - RN instead of manipulating a browser DOM will create and update native UI elements for you
- Build your app completely or partially using React
  - You could mix with native screens

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
layout: image-right
image: ../assets/react-native-styles.png
backgroundSize: contain
---

# Styling & Layout

- Only supports a basic subset of CSS
- Styles are written as objects with style names written in camel-case
- Limited cascade
- Common basics like `margin`, `padding`, `border`, `color`, `backgroundColor`...
- Some restricted to specific elements (as only `Text` can handle text)
- `position: relative | absolute`)
- Flex Layout only (via engine called yoga) (`display: none | flex`)

---

# Which libraries from a SPA can be used in RN?

- UI Libraries/Components for the web <v-click>❌</v-click>
  - MUI, Spectrum...
- CSS Frameworks <v-click>❌</v-click>
  - shadcn/ui, Bootstrap, Tailwind...
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
- Large ecosystem of native plugins/libraries which solve most native problems (which me, as a web developer, doesn't want to touch myself)

---

# Expo

- A meta framework (not facebook!) build upon React Native (yes, facebook...)
  - Like Next.js and Remix for React
- React Native delivers only the foundation to build apps for multiple platforms
- Expo brings a whole SDK of native libraries, toolchain and development flows

---

# Expo SDK

The SDK has libraries to solve problems like the following:

- Where is my user located (GPS)?
- What's the users device battery level?
- Keep the screen awake
- Get access to the file system/camera/haptics...

Can probably solve most of the problems why you've decided to create a native app over a web app

---

# Expo Go

- App freely available on iOS and Android
- Development client
- Includes the complete current Expo SDK
- Native code is "fixed", you can only change the JavaScript

---
transition: slide-left
---

# What if I need custom native Code?

Build your own dev client with development builds:

> By using development builds instead of Expo Go, you gain full control over the native runtime, so you can install any native libraries, modify any project configuration, or write your own native code.

This creates you own native SDK instead of using Expo Go.
