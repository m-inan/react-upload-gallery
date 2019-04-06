import React, { Component } from 'react'
import RUG, { DropArea } from 'react-upload-gallery'


class App extends Component {
    render() {
        return <RUG
            action="/api/upload"

            header={({ openDialogue }) => <DropArea>
                {isDrag => <div style={{ 
                        background: isDrag ? 'lightblue' : 'white', 
                        width: '100%', 
                        height: 250
                    }}>
                    <div style={{ padding: 30 }}>
                        <h1 style={{ textAlign: 'center' }}>Custom Handle</h1>

                        <div style={{ textAlign: 'center' }}>
                            <button onClick={openDialogue}>Open Dialogue</button>
                        </div>
                    </div>
                </div>}
            </DropArea>}

            footer={({ images, accept, setSort, uploadFiles, openDialogue }) => <div>
                <span style={{ marginRight: 20 }}>Count: { images.length }</span>
                
                <span>Accepted Types: { accept.join(', ') }</span>
            </div>}
        />
    }
}

export default App