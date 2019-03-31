# react-upload-image-gallery

Create a picture gallery for React, upload, change the order, and customize a library.

### Installation 
```bash
npm install react-upload-image-gallery
```

or:
```bash
yarn add react-upload-image-gallery
```


### Usage
```javascript
import RUIG from 'react-upload-image-gallery'

// Require style manually
import 'react-upload-image-gallery/dist/style.css' // or scss


<RUIG
  action="/api/upload" // upload route
  source={response => response.source} // response image source
/>
```