---
layout: section
hideInToc: false
---

# Expo

## Iterate with confidence.

---

# Expo

- A meta framework (not facebook!) build upon React Native (yes, facebook...)
  - Like Next.js, Remix or TanStack Start for React
  - Like Nuxt for Vue
  - Like SvelteKit for Svelte
- React Native delivers only the foundation to build apps for multiple platforms
- Expo brings a whole SDK of native libraries, toolchain and development flows

---

# [CNG – Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)

- React (Native) projects challenges
  - Hard to maintain, scale, and update
  - Cross-platform apps multiply complexity across platforms
- Therefore Expo leverages CNG
  - Generates short-lived native projects only when needed
  - Developers maintain only customization definitions, not full native code
  - Automates upgrades, library management, and customization
- CNG "input"
  - `app.config.ts`, prebuild templates, autolinking, native subscribers, and EAS credentials
  - Run `npx expo prebuild` to generate native projects on demand

---

# Expo SDK

The SDK has libraries to solve problems like the following:

- Where is my user located (GPS)?
- What's the users device battery level?
- Keep the screen awake
- Get access to the file system/camera/haptics...

Can probably solve most of the problems why you've decided to create a native app over a web app

---
layout: iframe
url: https://docs.expo.dev/versions/latest/
---

---

# Expo Go

- App freely available on iOS and Android
- A baseline development client
- Includes the complete current Expo SDK
- Native code is "fixed", you can only change the JavaScript
- Important to stay in sync with the current SDK package versions

---

# What if I need custom native Code?

## Or libraries outside the Expo SDK?

Build your own dev client with development builds:

> By using development builds instead of Expo Go, you gain full control over the native runtime, so you can install any native libraries, modify any project configuration, or write your own native code.

- Creates you own native SDK instead of using Expo Go
- Leverages CNG for you own dev client

---

# Writing your own native Code

- Expo Module
  - Can be either local or a reusable library
  - `npx create-expo-module@latest --local` create a scaffold with Swift and Kotlin within your project
  - Integrates seamlessly with CNG
- Turbo Module
  - The default React Native way of creating native modules
  - Might needs some more wiring within Expo
- Config Plugin
  - Plugins are a way to modify native project configuration or adding native dependencies
  - `Info.plist`, `AndroidManifest.xml`etc.

---

# [EAS – Expo Application Service](https://docs.expo.dev/eas/)

Cloud services for Expo and React Native apps, offering:

- Pipeline (build, E2E tests)
- Submitting to app store
- Certificate management
- Updates
- Hosting
- Fair free offering: 30 builds per month
- You can also use it locally!

➡️ Develop an iOS app without macOS hardware!

---

# Expo/EAS Updates

- Remember, your app consists of two parts:
  - Native Code
  - JS Code
- You can only ship new native code by submitting a new version on app/play store going through review
- Using Expo/EAS Update you can ship new JS code by yourself
  - Allows for faster bugfixes
  - Delivering small features/improvements easily
  - You still have to be careful to no upset Apple/Google 😉

---

# Development Loop

<img src="/assets/expo-development-loop.png" class="m-auto" style="max-height: 380px"/>

---

# Setup an Expo project

- Environment is the same as React Native – but mostly optional!
- Native IDEs only necessary for:
  - Simulator/emulator
  - Native development
  - Local builds

If you only want to use Expo Go, just install on your smartphone and get started:

```bash
npx create-expo-app@latest
```

Choose a template with:

```bash
npx create-expo-app@latest --template
```

---
transition: slide-left
---

# Start your assignment

- Create a button (`Pressable` or `TouchableOpacity`)
  - Try to style it!
- Use `expo-location` to retrieve the current location
- Display the location in an `Alert`
