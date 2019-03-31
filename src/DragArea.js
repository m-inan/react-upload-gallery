import React from 'react'
import {
    SortableContainer,
    SortableElement,
    arrayMove
} from 'react-sortable-hoc'

import Context from './Context'


const DragItem = SortableElement(({ children }) => children);

const SortableList = SortableContainer(({ children }) => children)


const DragArea = (props) => {
  const { children, className, style } = props

  return <Context.Consumer>
      { ({ images, setSort, openDialogue }) => 
        <SortableList {...props} helperClass="ruig-dragging-item" onSortEnd={({ oldIndex, newIndex }) => {
          setSort(arrayMove(images, oldIndex, newIndex))
        }}>
          <div className={className} style={style}>
              { images.map((image, key) => <DragItem index={key} key={key}>{ children(image) }</DragItem>) }
          </div>
        </SortableList> }
    </Context.Consumer>
}


DragArea.defaultProps = {
  lockAxis: null,
  useWindowAsScrollContainer: true,
  pressDelay: 200,
  axis: 'xy',
  style: {}
}


export default  DragArea