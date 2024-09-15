# Settlements

Settlements is a web app that helps you track expenses and debts among a group of people. It's perfect for keeping a summary of all payments and transfers related to a trip taken together.

## Features

- Create an account and log in using Firebase
- Add all payments and transfers
- Automatically calculate if any additional transfers are required to balance accounts
- Make settlements public so that anyone with a link can edit them

## Technical details

The code was written mostly using Cursor IDE and Open AI ChatGPT o1-mini and o1-preview. There were some manual changes made to the code but the main idea was to check how helpful are the new models from Open AI. 

And they are a lot! 

Here's the initial conversation with o1-preview: https://chatgpt.com/share/66e5ca07-3a2c-8005-b8f7-7e62b7d14e4f.

I copied all of the code from the response and it worked just as intended. Except the part where I had to add the uuid package to package.json manually. But all ACs were met by the code.


Below you can find the original README that was generated by Vite.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
