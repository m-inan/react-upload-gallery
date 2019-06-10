# React Upload Gallery

[![npm](https://img.shields.io/npm/v/react-upload-gallery.svg)](https://www.npmjs.com/package/react-upload-gallery)
[![license](https://img.shields.io/npm/l/react-upload-gallery.svg)](LICENSE)
[![Build Status](https://travis-ci.org/TPMinan/react-upload-gallery.svg?branch=master)](https://travis-ci.org/TPMinan/react-upload-gallery)
[![Open Issues](https://img.shields.io/github/issues/TPMinan/react-upload-gallery.svg)](https://github.com/TPMinan/react-upload-gallery/issues)

A simple library that lets you create an image gallery, change the order of images, select the highlighted image, and customize it as you like.

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
### ScreenShot
<img src="https://github.com/TPMinan/react-upload-gallery/blob/master/images/screenshot.png?raw=true" width="100%">

### Overview
React Upload Gallery Prepares your images for the gallery on a React-based application. You can change the user interface by using the features available on all topics. Like re-creating video cards or writing browser APi requests privately. You can carry these features wherever you want thanks to ready-made components. `<DragArea />` and `<DropArea />` components `header`,` footer` and `childnode` can use the features you can use.

With these you can determine the limit, size, maximum and minimum width and length of the images and prevent them from loading. You can display the appropriate message with two parameters, `(key, rules)`, using `onWarning` to warn the blocked images.

It can be used to inquire, display in modal, or display a message before it is deleted using features like `onConfirmDelete`,` onDeleted`, `onClick`,` onSuccess`.

A library that will make things easier within the React framework for galleries used for an article, product or advertisement system in general. You can set rules, track errors, make a special request, and customize all features.


### Quick Referance
- Props
  - [Sorting](#Sorting)
  - [Rules](#Rules)
  - [CustomRequest](#CustomRequest)
  - [onChange](#onChange)
  - [onClick](#onClick)
  - [onConfirmDelete](#onConfirmDelete)

- Components
  - [`<DragArea />`](#DragArea)
  - [`<DropArea />`](#DropArea)
  - [`<Card />`](#Card)
  - [`<List />`](#List)
  - [`<Children />`](#Children)

### Props

| Props  			| Type 						| Default 						| Description		|
|:-------			|:-------					|:--------						|:-------			|
| `action`			| `String`  				| `empty`						| Route to upload. |
| `className`		| `String`  				| `empty`						| Classes to add to the parent component. |
| `ssrSupport`		| `Bolean`  				| `false`						| With `true 'you can hide components on the service side. |
| `send`			| `Object`					| `{}`							| In addition to the base64 data sent with the name `data`, different values can be sent. |
| `headers`			| `Object`					| `{}`							| The data sent here is added to the `Request Headers`.
| `style`			| `Object`					| `{}`							| Added to the parent component as a style property |
| `accept`			| `Array`					| ['jpg', 'jpeg', 'png', 'gif']	| It will block files sent outside the types of the requested types |
| `initialState`	| `Array`					| `[]`							| Existing data is added to the state of type `[{source: 'image url', name: '...'}]. |
| `type`			| `String`					| `card`						| There are two different display options available in the package. These are `card` and` list` |
| `sorting`			| `Bolean` OR `Object`		| `true`						| You can turn off sorting or customize it using `false`. [Sorting](#Sorting) |
| `header`			| `Bolean` OR `Function`	| `true`						| You can close or add a custom holder. `function({ images, accept, uploadFiles, openDialogue })` |
| `footer`			| `Bolean` Or `Function`	| `false`						| `function({ images, accept, uploadFiles, openDialogue })` |
| `rules`			| `Object`					| `null`						| `size`,` limit`, `width`,` height` features can be limited. [Rules](#Rules) |
| `customRequest`	| `Function`				| `null`						| You can customize the http request in your own way. [CustomRequest](#CustomRequest) |
| `source`			| `Function`				| `null`						| Enter the url of the photo from the returned answer. `(response) => response.url` |
| `onSuccess`		| `Function`				| `empty`						| Return for uploaded image. `function(image)` |
| `onWarning`		| `Function`				| `empty`						| Returns elements that do not conform to rules created in `accept` or` rules`. [Rules](#Rules) |
| `onDeleted`		| `Function`				| `empty`						| Returns the information of the deleted image. `function(image)` |
| `onChange`		| `Function`				| `empty`						| Works when application starts and any state changes. |
| `onError`			| `Function`				| `empty`						| Returns `status`,` response` if http request fails. `function({ status, response, image })` |
| `onClick`			| `Function`				| `empty`						| Keeps clicks on the display card. [onClick](#onClick) |
| `onConfirmDelete` | `Function`				| `empty`						| Attempting to delete the image will ask you one last time. [onConfirmDelete](#onConfirmDelete)

#### Sorting
Options for this feature can be found at this address. [Sorting Props](https://github.com/clauderic/react-sortable-hoc#prop-types)

```javascript
<RUG sorting={false} />
// OR
<RUG sorting={{ lockAxis: 'x' }} />
```
    
#### Rules
Images that do not comply with the specified rules will be eliminated during loading. Eliminated images will be returned in `File` format with the rules used in the` type` parameter.

```javascript
<RUG
  rules={{
    limit: 10,
    size: 20,
    width: {
      min: 1280,
      max: 1920,
    },
    height: {
      min: 720,
      max: 1080
    }
  }}

  accept={['jpg', 'jpeg']}

  onWarning={(type, rules) => {
    switch(type) {
      case 'accept':
        console.log(`Only ${rules.accept.join(', ')}`)

      case 'limit':
        console.log('limit <= ', rules.limit)

      case 'size':
        console.log('max size <= ', rules.size)

      case 'minWidth': case 'minHeight':
        console.log('Dimensions > ', `${rules.width.min}x${rules.height.min}`)

      case 'maxWidth': case 'maxHeight':
        console.log('Dimensions < ', `${rules.width.max}x${rules.height.max}`)

      default:
    }
  }}
/>
```

#### CustomRequest
With this feature, you can make the request more easily and how the values should be sent. The request in the package sends the `data` object received with` base64` as `Content-Type: Application / json`. In some cases, APIs may request data as a file or as a blob. In the case of a font that must be returned, the first parameter must be fixed as `uid`. `onError` is fully optional.
```javascript
<RUG
  customRequest={({
    uid,
    file,
    data, // base64
    send,
    action,
    headers,
    onProgress,
    onSuccess,
    onError
  }) => {
    const response = { url: '...' }

    onProgress(uid, response)
    onSuccess(uid, response)
    onError(uid, {
      action,
      status,
      response
    })
  }

  source={response => response.url}
/>
```

#### onChange
With this feature, any changes work when a new image is added, deleted, or changed in order. The package will run once when it first starts.
```javascript
<RUG
  onChange={(images) => {
    this.setState({ images }) // save current component
  }}
/>
```

#### onClick
You can use it to hold clicks on the image. For example, you can save the sent parameter in `state` and use` select`, `remove`,` abort`, `refresh` functions.
```javascript
<RUG
  onClick={(image) => this.setState({ image })}
/>
```

#### onConfirmDelete
A nice solution to check the image one last time before it is deleted. Returns `true 'by default. This confirms the deletion. You can return `Promise` data in the function.
```javascript
<RUG
  onConfirmDelete={(currentImage, images) => {
    return window.confirm('Are you sure you want to delete?')
  }}
/>
```
OR Promise alternative.

```javascript
<RUG
  onConfirmDelet={(currentImage, images) => {
    return new Promise(resolve => {
      // For example, you can affect the loading screen here
      this.setState({ loading: true })
        
      setTimeout(() => resolve(true), 1000)
    })
  }}
/>
```

### Components

```javascript
import RUG, { DragArea, DropArea, Card, List } from 'react-upload-gallery'
```

#### DragArea
Thanks to the `DragArea` component you can import elements from the` callback` if you want to create a special image. To use the features [here] (https://github.com/clauderic/react-sortable-hoc#prop-types) you can look.

```javascript
<RUG>
  <DragArea {...props}>
  {
    (image) => <div>
      <img src={image.source} alt={image.name} />
    </div>
  }
  </DragArea>
</RUG>
```

#### DropArea
You can use the `DropArea` component in` header`, `footer` or` children` properties. It will load the dropped images. You can check that the installation was attempted from the first parameter.
```javascript
<RUG
  header={({ openDialogue }) => (
    <DropArea>
    {
      (isDrag) => <div style={{ background: isDrag ? 'yellow' : '#fff' }}>
        <button onClick={openDialogue}>Open</button>
      </div>
    }
    </DropArea>
  )}
/>
```

#### Card
Not many customizable features are available for the `Card` component. But if you want, you can add a few different features within a `div` tag.
```javascript
<RUG>
  <DragArea>
  {
    (image) => (
      <div>
        <Card image={image} />

        <button onClick={image.select}>Select Active</button>
      </div>
    )
  }
  </DragArea>
</RUG>
```

#### List
```javascript
<RUG>
  <DragArea>
  {
    (image) => <List image={image} />
  }
  </DragArea>
</RUG>
```
#### Children
You can design images in different formats using `ReactNode` or` Function` types. If you are using `DragArea` the images will be returned with` callback` already. But if you are not using `Children` for a` Function` by turning back all the pictures you can get. It is also possible to reach several options with the second parameter.

```javascript
<RUG>
{
  (images) => (
    <div>
    {
      images.map(image => (
          <div>
            <img src={image.source} />
          </div>
        )
      })
    }
    </div>
  )
}
</RUG>
```
OR
```javascript
<RUG>
  <DropArea> // handle drop files on list of images
  {
    (isDrag) => (
      <DragArea>
      {
        (image) => (
          <div>
            <img src={image.source} />
          </div>
        )
      }
      </DragArea>
    )
  }
  </DropArea>
</RUG>
````

### Dependencies
React Upload Gallery [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc), [@Babel/runtime](https://babeljs.io/docs/en/babel-runtime) and [Prop-Types](https://www.npmjs.com/package/prop-types) needs packages. 

### Reporting Issues
If believe you've found an issue, please [report it](https://github.com/TPMinan/react-upload-gallery/issues) along with any relevant details to reproduce it. The easiest way to do so is to fork the react-sortable-hoc basic setup sandbox on [CodeSandbox:](https://codesandbox.io/s/2x2n3m17yp)

### Asking for help 
Please do not use the issue tracker for personal support requests. Instead, use StackOverflow.

### Contributions 
Yes please! Feature requests / pull requests are welcome.
