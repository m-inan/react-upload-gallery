import React, { Component } from 'react'
import RUG, { Card, DragArea } from 'react-upload-gallery'


class App extends Component {
    render() {
        return <RUG
            action="/api/upload"

            onConfirmDelete={() => window.confirm('Are you sure you want to delete?')}

            onDeleted={(deletedImage, images) => {
                console.log(deletedImage, images)
                if ( deletedImage.selected && images.length ) {
                    images[0].select()
                }
            }}
        >
            <DragArea className="rug-items __card">
                { image => <div style={{ border: `1px solid ${image.selected ? 'green' : 'transparent'}` }}>
                    <Card image={image} />

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={image.select}>Select</button>
                        <button onClick={image.remove}>Remove</button>
                    </div>
                </div> }
            </DragArea>
        </RUG>
    }
}

export default App