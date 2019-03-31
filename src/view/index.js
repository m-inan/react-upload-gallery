import React from 'react'

import List from './List'
import Card from './Card'
import DragArea from '../DragArea'


const Item = (type, image) => {
    switch(type) {
        case 'card':
            return <Card image={image} />

        case 'list':
            return <List image={image} />

        default: ;
    }
}


export default ({ type, sorting }, images) => {
    const className = `ruig-items __${type} ${sorting ? '__sorting' : ''}`

    const options = typeof sorting === 'object' ? sorting : {};


    return sorting ? (
        <DragArea {...options} className={className}>
            { image => <div className="ruig-item">
                { Item(type, image) }
            </div> }
        </DragArea>
    ) : (
        <div className={className}>
            { images.map((image, key) => <div className="ruig-item" key={key}>
                { Item(type, image) }
            </div>) }
        </div>
    )
}


export {
    List,
    Card
}