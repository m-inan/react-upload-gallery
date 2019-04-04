import React, { Component } from 'react'

import RUIG from 'react-upload-image-gallery'
import 'react-upload-image-gallery/dist/style.css'


class App extends Component {
    render() {
        return <RUIG
            action="http://example.com/api/upload"
            source={(response) => `http://example.com/${response.source}`}
        />
    }
}

export default App