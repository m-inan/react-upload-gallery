# React Upload Gallery

[![npm](https://img.shields.io/npm/v/react-upload-gallery.svg)](https://www.npmjs.com/package/react-upload-gallery)
[![license](https://img.shields.io/npm/l/react-upload-gallery.svg)](LICENSE)
[![Build Status](https://travis-ci.org/TPMinan/react-upload-gallery.svg?branch=master)](https://travis-ci.org/TPMinan/react-upload-gallery)
[![Open Issues](https://img.shields.io/github/issues/TPMinan/react-upload-gallery.svg)](https://github.com/TPMinan/react-upload-gallery/issues)

Create a picture gallery for React, upload, change the order, and customize a library.

### Installation 
```bash
npm install react-upload-gallery
```

or:
```bash
yarn add react-upload-gallery
```


### Usage
```javascript
import RUG from 'react-upload-gallery'

// Add style manually
import 'react-upload-gallery/dist/style.css' // or scss

<RUG
  action="/api/upload" // upload route
  source={response => response.source} // response image source
/>
```