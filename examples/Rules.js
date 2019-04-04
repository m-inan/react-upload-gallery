import React, { Component } from 'react'
import RUIG from 'react-upload-image-gallery'


export default class App extends Component {

    render() {
        return <RUIG
            action="/api/upload"

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
    }
}