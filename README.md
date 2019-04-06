# react-upload-gallery

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