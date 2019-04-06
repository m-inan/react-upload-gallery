import React from 'react'
import DropArea from './DropArea'


export default ({
    openDialogue
}) => <DropArea>
    { isDrag => <div className={`rug-handle ${isDrag ? '__dragging' : ''}`}>
        <svg viewBox="0 -5 32 52" className="rug-handle-icon">
            <g>
                <polyline points="1 19 1 31 31 31 31 19"/>
                <polyline className="__arrow" points="8 9 16 1 24 9"/>
                <line className="__arrow" x1="16" x2="16" y1="1" y2="25"/>
            </g>
        </svg>

        <div className="rug-handle-info">
            <div className="rug-handle-drop-text">Drag and drop Images Here to Upload</div>

            <span>Or</span>

            <div onClick={openDialogue} className="rug-handle-button">
                Select Images to Upload
            </div>
        </div>
    </div> }
</DropArea>