import React from 'react'
import RefreshIcon from './RefreshIcon'


export default class List extends React.Component {
    constructor() {
        super()

        this.state = { spin: false }
    }

    render() {
        const {
            image: { 
                uid,
                name,
                size,
                done,
                abort,
                click,
                error,
                remove,
                source,
                refresh,
                progress,
            },
            ...props
        } = this.props,
        {
            spin
        } = this.state,

        showProgress = !done && !error ? '__active' : ''


        return <div
            {...props}
            key={uid}
            className="ruig-list">

            <div className={`ruig-list-progress ${showProgress}`} style={{ width: `${progress}%` }} />
            
            <span className={`ruig-list-progress-count ${showProgress}`}>{ progress || 0 }%</span>

            { error && typeof refresh === 'function' && <div
                onClick={() => {
                    if ( spin ) return;

                    this.setState({ spin: true })

                    setTimeout(() => {
                        this.setState({ spin: false })

                        refresh()
                    }, 700)
                }}
                className={`ruig-list-refresh ${spin ? '__spin' : ''}`}>
                <div style={{ padding: 3 }}>
                    <RefreshIcon />
                </div>
            </div> }

            <div className="ruig-list-image" onClick={click}>
                <img src={source} alt={name} />
            </div>

            <div className="ruig-list-content" onClick={click}>
                <div className="ruig-list-name">{ name }</div>
                <div className="ruig-list-size">{ size }</div>
            </div>

            <div className="ruig-list-remove" onClick={remove}> 
                <svg viewBox="0 0 40 40">
                    <path
                        stroke="current"
                        strokeLinecap="round"
                        strokeWidth="4" d="M 10,10 L 30,30 M 30,10 L 10,30">
                    </path>
                </svg>
            </div>
        </div>
    }
}