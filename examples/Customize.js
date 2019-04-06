import React, { Component } from 'react'
import RUG, { DragArea, DropArea } from 'react-upload-gallery'


const Image = ({
    uid,
    name,
    size,
    done,
    abort,
    click,
    error,
    remove,
    select,
    source,
    refresh,
    progress,
    selected
}) => (<div style={{ ...style.image, ...(selected ? style.selected : {}) }}>
    { done && <div style={style.done} /> }
    { error && <div style={style.error} /> }
    { (!done && !error) && <div style={{ ...style.progress, width: `${progress}%` }} /> }

    <h3 style={{ whiteSpace: 'nowrap' }}>{ name } - { size }</h3>

    <img src={source} alt="" style={{ width: 250, height: 200 }}/>

    <div style={style.controls}>
        <button onClick={select} style={style.selectBTN}>Select</button>
        <button onClick={remove} style={style.removeBTN}>Remove</button>
    </div>
</div>)

const limit = 12

export default class App extends Component {
    render() {
        return <RUG action="/api/upload" header={false} rules={{ limit }}>
        { 
            (images, { openDialogue }) => {
                const length = images.length

                return <DropArea>
                {
                    isDrag => <div style={{ ...style.content, ...(isDrag ? { borderColor: 'rgb(0, 122, 255)' } : {}) }}>
                        <div style={style.header}>
                            <button 
                                style={style.button}
                                onClick={openDialogue}>
                                Select Images
                            </button>

                            <div style={{ flex: 1, margin: 7 }}>
                                <div style={{
                                    ...style.totalProgress,
                                    width: ((images.length / limit) * 100) + '%'
                                }}>
                                    <span style={{ marginRight: 10 }}>
                                        { length > 0 && `${length} / ${limit}` }
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        { length ? <DragArea style={style.imageArea}>
                            {
                                image => <div>
                                    <Image {...image} />
                                </div>
                            }
                        </DragArea> : (
                            <div style={isDrag ? { color: 'rgb(0, 122, 255)' } : {}}>
                                <h1 style={style.dropAreaText}>Drop Image Here</h1>
                            </div>
                        )}
                    </div>
                }
                </DropArea>
            }
        }
        </RUG>
    }
}

const style = {
    content: {
        border: '3px dashed rgb(61, 72, 82)',
        minHeight: 250
    },

    header: {
        display: 'flex'
    },

    button: {
        background: 'rgb(0, 122, 255)',
        borderRadius: '3px',
        padding: '7px 12px',
        fontSize: '16px',
        color: 'rgb(245, 245, 245)',
        textAlign: 'center',
        cursor: 'pointer',
        minWidth: '150px',
        outline: 'none'
    },

    totalProgress: {
        height: 30,
        lineHeight: '30px',
        background: 'rgb(0, 122, 255)',
        transition: 'width 500ms ease',
        textAlign: 'right',
        color: '#fff',
        fontSize: 18,
        borderRadius: '3px'
    },

    dropAreaText: {
        textAlign: 'center',
        margin: '60px 0',
        fontFamily: 'Helvetica Neue',
        fontWeight: '300',
        fontSize: 50
    },

    imageArea: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    
    image: {
        width: 250,
        height: 300,
        fontFamily: 'Helvetica Neue',
        position: 'relative',
        overflow: 'hidden'
    },

    controls: {
        display: 'flex'
    },

    selectBTN: {
        flex: 1,
        background: 'green',
        color: '#fff',
        padding: '6px 0'
    },
    removeBTN: {
        flex: 1,
        background: 'red',
        color: '#fff',
        padding: '6px 0'
    },

    progress: {
        height: 3,
        background: 'rgb(0, 122, 255)',
        transition: 'width 500ms ease',
        borderRadius: '3px'
    },

    error: {
        width: 50,
        height: 50,
        background: 'red',
        borderRadius: 25,
        position: 'absolute',
        top: 'calc(50% - 25px)',
        left: 'calc(50% - 25px)',
    },

    done: {
        width: 50,
        height: 50,
        background: 'green',
        borderRadius: 25,
        position: 'absolute',
        top: 'calc(50% - 25px)',
        left: 'calc(50% - 25px)',
    },

    selected: {
        border: '2px solid green'
    }
}