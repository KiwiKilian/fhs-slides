---
theme: '@kiwikilian/slidev-theme-fhs'
favicon: node_modules/@kiwikilian/slidev-theme-fhs/assets/favicon.svg
title: Frontend Engineering – Kilian Finger – 2025
info: |
  # Frontend Engineering
  ## [Kilian Finger](https://www.kilianfinger.com/) – 2025
download: true
defaults:
  hideInToc: true
transition: slide-up
layout: intro
---

# Frontend Engineering

## A practical guide to React (Native)

FHS 2025 SS MMT-M – [Kilian Finger](https://www.kilianfinger.com/)

---
layout: default
transition: slide-left
---

# Table of contents

<Toc minDepth="1" maxDepth="1"></Toc>

---
src: ./sections/1-roadmap.md
---

---
src: ./sections/2-react-native.md
---

---
src: ./sections/3-expo.md
---

---
src: ./sections/4-setup.md
---

---
src: ./sections/5-stack.md
---

---

# Assignment

Create a routing app with the following features:

- Input for origin and destination (Photon API)
- Fetch route from origin to destination (OSRM API)
- Display the calculated route on a map
- Implement these features for bonus points:
  - Add current location button for origin/destination
    - Use Photon reverse geocoding to display name of location
    - Add current location as bias to geocoding
  - Save/load favorite locations or routers using zustand with persist through AsyncStorage
    - Also store origin/destination in AsyncStorage

Full assignment on the wiki!

---

# Assignment Setup

- Start with a TypeScript template

```bash
$ npx create-expo-app@latest --template
? Choose a template: › - Use arrow-keys. Return to submit.
    Default
    Blank
❯   Blank (TypeScript)
❯   Navigation (TypeScript) - File-based routing with TypeScript enabled
    Blank (Bare)
```

- Setup ESLint and Prettier: https://docs.expo.dev/guides/using-eslint/
- Setup [`@heyapi/openapi-ts`](https://github.com/hey-api/openapi-ts)
  - Routing: https://github.com/1papaya/osrm-openapi/blob/master/osrm-openapi.yaml
  - Geocoding: https://gist.github.com/KiwiKilian/1f9d35544a7e9312bb74bd75a889df9c
- Setup [`@tanstack/react-query`](https://tanstack.com/query/latest/docs/framework/react/installation)

---
layout: center
class: text-center
---

# Thanks for participating 👋

[GitHub](https://github.com/KiwiKilian/fhs-slides/tree/main/2025-ss-mmt-m-frontend-engineering) · [kilianfinger.com](https://www.kilianfinger.com/)
