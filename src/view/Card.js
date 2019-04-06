import React from 'react'
import RefreshIcon from './RefreshIcon'


export default class Card extends React.Component {
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
                progress
            },
            ...props
        } = this.props,
        {
            spin
        } = this.state

        return <div
            {...props}
            key={uid}
            className={`rug-card ${error ? '__error' : ''}`}>
            
            <div className="rug-card-name" onClick={click}>
                <div>
                    { name }

                    <div className="rug-card-size">{ size }</div>
                </div>
            </div>

            <div style={{ backgroundImage: `url(${source})` }} onClick={click} className="rug-card-image" />
            
            { !done && !error && <>
                <svg viewBox="0 0 36 38" className="rug-card-progress">
                    <path className="__progress-cricle"
                        style={{ strokeDasharray: `${progress}, 100` }}
                        d="M18 2.5845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>

                <div className="rug-card-progress-count">{ progress }</div>
            </> }

            { error && typeof refresh === 'function' && <div
                onClick={() => {
                    if ( spin ) return;

                    this.setState({ spin: true })

                    setTimeout(() => {
                        this.setState({ spin: false })

                        refresh()
                    }, 700)
                }}
                className={`rug-card-refresh ${spin ? '__spin' : ''}`}>
                <div style={{ padding: 7 }}>
                    <RefreshIcon />
                </div>
            </div> }


            <div className="rug-card-remove" onClick={remove}> 
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