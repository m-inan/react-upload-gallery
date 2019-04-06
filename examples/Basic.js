import React, { Component } from 'react'

import RUG from 'react-upload-gallery'
import 'react-upload-gallery/dist/style.css'


class App extends Component {
    render() {
        return <RUG
            action="http://example.com/api/upload"
            source={(response) => `http://example.com/${response.source}`}
        />
    }
}

export default App