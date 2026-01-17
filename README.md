# vCard Business Card for Solid

A lightweight, elegant web component that renders a beautiful business card from a [Solid Pod](https://solidproject.org/) vCard profile. This component automatically fetches and displays profile information stored in your Solid Pod using the vCard vocabulary.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![npm](https://img.shields.io/npm/v/solid-vcard-business-card)

## Features

- 🎨 **Elegant Design** - Premium business card styling with animated golden gradients
- 🔒 **Solid Pod Integration** - Fetches profile data directly from Solid Pods
- 📇 **vCard Standard** - Uses the standard vCard vocabulary


## Installation

```bash
npm install solid-vcard-business-card
```

## Quick Start

### In a JavaScript Module

```javascript
import 'solid-vcard-business-card';
```

Then use the component in your HTML:

```html
<solid-business-card src="https://your-pod.solidcommunity.net/profile/card#me"></solid-business-card>
```

### In HTML (with bundler)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Business Card</title>
</head>
<body>
    <solid-business-card src="https://your-pod.solidcommunity.net/profile/card#me"></solid-business-card>
    
    <script type="module">
        import 'solid-vcard-business-card';
    </script>
</body>
</html>
```

### Vue 3 Example

**main.js or main.ts:**
```javascript
import { createApp } from 'vue';
import App from './App.vue';
import 'solid-vcard-business-card';

const app = createApp(App);

// Configure Vue to recognize the custom element
app.config.compilerOptions.isCustomElement = (tag) => tag === 'solid-business-card';

app.mount('#app');
```

**Component:**
```vue
<script setup>
import { ref } from 'vue';

const profileUrl = ref('https://your-pod.solidcommunity.net/profile/card#me');
</script>

<template>
  <solid-business-card :src="profileUrl"></solid-business-card>
</template>
```

### React Example

**index.js or main.tsx:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'solid-vcard-business-card'; // Register the web component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**App.jsx:**
```jsx

function App() {
  return (
    <solid-business-card 
      src="https://your-pod.solidcommunity.net/profile/card#me"
    />
  );
}

export default App;
```

## Profile Requirements

Your Solid Pod profile must use the vCard vocabulary with the following fields:

### Required Fields

- **Full Name** (`vcard:fn`) - Your full name

### Optional Fields

- **Email** (`vcard:hasEmail`) - Your email address
- **Birthday** (`vcard:bday`) - Your date of birth
- **Photo** (`vcard:hasPhoto`) - URL to your profile picture

### Example Profile Structure

```turtle
PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
PREFIX rdfa: <http://www.w3.org/ns/rdfa#>

<https://id.inrupt.com/example> a vcard:Individual;
   vcard:hasEmail <mailto:example@example.com>;
   vcard:fn "Example User";
   vcard:bday "17-03-2001";
   vcard:hasPhoto <image url> .

```

**Note:** Ensure your profile has public read permissions so the component can fetch it.


## Browser Support

This component uses native Web Components (Custom Elements) and is supported in:
- Chrome/Edge 67+
- Firefox 63+
- Safari 10.1+
- Opera 54+

## Error Handling

The component displays user-friendly error messages if:
- The profile URL is invalid or unreachable
- The profile doesn't contain vCard data
- Network issues occur

## Privacy & Security

- The component only **reads** public profile data
- No authentication is required
- No data is stored or transmitted to third parties
- All communication is direct between the browser and the Solid Pod

## Dependencies

- [`@inrupt/solid-client`](https://www.npmjs.com/package/@inrupt/solid-client) - Solid Pod data operations
- [`@inrupt/vocab-common-rdf`](https://www.npmjs.com/package/@inrupt/vocab-common-rdf) - RDF vocabularies including vCard


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [Solid Project](https://solidproject.org/)
- [vCard Ontology](http://www.w3.org/2006/vcard/ns)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

Made with ❤️ for the Solid community

