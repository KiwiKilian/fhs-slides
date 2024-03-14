---
layout: section
hideInToc: false
---

# Setup a ~~React (Native)~~ JavaScript Project
## Creating your project environment

---

# Setup
- Most of this applies to any kind of JavaScript project
- Some of this applies to React and React Native
- Some only applies to React Native

---

# Use TypeScript

- Easy setup in React (Native)
- Most libraries in the React ecosystem support TypeScript very well
- Makes working with props and refactorings very easy
- If not absolutely new to TypeScript: Enable `strict` mode

```tsx twoslash
import React from 'react';

type ComponentProps = { title: string };

function Component({ title }: ComponentProps) {
  return <>{title}</>;
}

function App() {
  return <Component />;
}
```

---

# Creating complex Props

<div class="grid grid-cols-2 gap-4">
<div>

- Generics for typesafe reusability
  - This components works with any enum
- Unions for conditional typings
  - Takes either an i18n object or a component for labeling

```tsx
type CheckboxGroupProps<T extends string> = {
  values: Record<T, boolean>;
  onChange: (option: T) => void;
} & (
  | {
    i18n: Record<T, string>;
    optionLabel?: never;
  }
  | { 
    i18n?: never; 
    optionLabel: FunctionComponent<{ option: T }> 
  }
);
```

</div>
<div>


```tsx
export function CheckboxGroup<T extends string>({
  values,
  i18n,
  optionLabel,
  onChange,
}: CheckboxGroupProps<T>) {
  return (
    <Box role="group">
      <List>
        {Object.keys(options).map((option) => (
          <ListItem key={option}>
            <Checkbox
              label={(
                i18n && i18n[option]) || 
                (optionLabel && optionLabel({ option })
              )}
              checked={values[option]}
              onChange={() => onChange(option)}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
```
</div>
</div>

---

# Use a Path Alias

- Move your own source code to `src` directory[^1]
  - All code which will be compiled into the bundle itself
  - Excluding configs, `public`, `scripts`, dev tools
- Setup `@` alias for the `src` directory
- Results
  - Cleaner imports
  - Less churn when moving files


```diff
- import Component from '../../components/Component';
+ import Component from '@/components/Component';
```

<!-- Footer -->
[^1]: https://docs.expo.dev/router/reference/src-directory/

---

# Setup Path Alias


`tsconfig.json`[^1]
```json
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"]
  }
}
```

`.eslintrc`
```js
'no-restricted-imports': ['error',
  { patterns: [
    {
      group: ['./', '../'],
      message: "Use '@/...' alias instead.",
    },
  ]},
],
```

<!-- Footer -->
[^1]: https://docs.expo.dev/guides/typescript/#path-aliases

---

# Use `app.config.ts` 📱

Brings type-safety to your config[^1]

```bash
npm install ts-node --save-dev
```

```ts
import 'ts-node/register';
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'my-app',
  slug: 'my-app',
};

export default config;
```

<!-- Footer -->
[^1]: https://docs.expo.dev/guides/typescript/#appconfigjs

---

# Use a tight ESLint Config

[//]: # (TODO SCROLL)
```js {2|10-28|29-55}{maxHeight:'100%'}
module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript', 'prettier'],

  parserOptions: { project: './tsconfig.json' },

  root: true,

  ignorePatterns: ['.eslintrc.js'],

  rules: {
    'id-denylist': ['error', 'cb', 'e', 'err', 'ev', 'i', 'j', 'val'],

    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never', '': 'never' },
    ],
    'import/no-default-export': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external', 'internal']],
        alphabetize: { order: 'asc', orderImportKind: 'asc' },
      },
    ],
    'import/prefer-default-export': 'off',

    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['./', '../'],
            message: "Use '@/...' alias instead.",
          },
        ],
      },
    ],

    'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
      
    'no-param-reassign': ['error', { props: false }],

    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'function-expression',
      },
    ],
    'react/jsx-key': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
  },
};

```

---

# Setup your linting scripts

`package.json.scripts`
```json
"lint": "npm run lint:tsc && npm run lint:eslint",
"lint:tsc": "tsc --noemit",
"lint:eslint": "eslint './src/**/*.{ts,tsx}' --fix"
```

- Keep those linters happy at all times on `main`/`develop`
  - Merge only with zero warnings and errors
  - Starting out loose takes more time in the end
- Add CI/CD to enforce these

---

# `React.StrictMode`

Strict Mode enables the following development-only behaviors: [^1]

- Your components will re-render an extra time to find bugs caused by impure rendering
- Your components will re-run Effects an extra time to find bugs caused by missing Effect cleanup
- Your components will be checked for usage of deprecated APIs

**All of these checks are development-only and do not impact the production build.**

In your most root file (`index.tsx`, `App.tsx`, `_layout.tsx`):
```tsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

<!-- Footer -->
[^1]: https://react.dev/reference/react/StrictMode#strictmode

---
transition: slide-left
---

# Let's view at your Setup as a Mob

Mob programming:
- 1 driver has the keyboard
- 1 navigator makes the decisions
- The whole mobs discusses together
- Roles switch every 10 to 15 Minutes
