import React from 'react'
import { defaultProps, propTypes } from './PropTypes'


import Handle from './Handle'
import Context from './Context'
import Request from './Request'
import DragArea from './DragArea'
import DropArea from './DropArea'
import View, { List, Card } from './view'


import {
    getBase64,
    bytesToSize,
    isAccepted,
    getImageDimensions
} from './Utils'





class RUIG extends React.Component {

    constructor({ initialState, ssrSupport }) {
        super()


        this.fileInput = React.createRef()
        this.setSort = this.setSort.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
        this.openDialogue = this.openDialogue.bind(this)


        this.onProgress = this.onProgress.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
        this.onWarning = this.onWarning.bind(this)
        this.onError = this.onError.bind(this)


        this.requests = []
        this.increment = 0

        
        this.state = {
            images: initialState.reverse().map(item => {

                return this.create({
                    done: true,
                    ...item
                })
            }).reverse(),

            renderComponent: !ssrSupport
        }
    }

    componentDidMount() {
        const { ssrSupport, onChange } = this.props

        
        // start application send initialState images
        onChange(this.state.images)


        // ssrSupport
        if ( ssrSupport ) {
            this.setState({ renderComponent: true })
        }
    }


    create(item) {
        const uid = `rug-${Date.now()}-${this.increment++}`

        return {
            uid,
            done: false,
            error: false,
            progress: 0,
            refresh: null,
            abort: () => {},
            remove: () => this.remove(uid),
            click: () => this.onClick(uid),
            select: () => this.onSelected(uid),
            ...item
        }
    }


    refresh(uid) {
        this.setImage(
            uid,
            {
                error: false,
                progress: 0
            },
            image => this.upload(image)
        )
    }


    async remove(uid) {
        const { images } = this.state; let deletedImage;


        for ( const key in images ) {
            const image = images[key]


            if ( image.uid === uid ) {
                if ( await this.props.onConfirmDelete(image, images) ) {
                    if ( typeof image.abort === 'function' ) {
                        image.abort()
                    }

                    deletedImage = image
                    images.splice(key, 1)
                }
            }
        }
    

        this.setState({ images }, () => {
            this.props.onChange(this.state.images)

            if ( deletedImage ) {
                this.props.onDeleted(deletedImage, this.state.images)
            }
        })
    }


    onProgress({ uid, percentage }) {
        this.setImage(uid, { progress: isNaN(percentage) ? 0 : percentage })
    }


    async onSuccess({ response, uid }) {
        let { source } = this.props


        source = (
            typeof source === 'function' ? source(response) : response.source
        )

        this.setImage(
            uid, 
            {
                source,
                done: true,
                error: false,
                progress: 100
            }, 
            () => this.props.onSuccess(this.state.images)
        )
    }


    onError({ uid, status, response }) {
        this.setImage(
            uid, 
            {
                status,
                error: true,
                refresh: () => this.refresh(uid)
            },
            image => {
                this.props.onError({
                    status,
                    response,
                    image
                })
            }
        )
    }


    onClick(uid) {
        this.props.onClick(
            this.state.images.find(
                image => image.uid === uid
            )
        )
    }

    
    onWarning(key, rules) {
        this.props.onWarning(key, rules)
    }


    setImage(uid, append, finish) {
        let image, { images } = this.state

        images = images.map(item => {
            if ( item.uid === uid ) {
                return image = { ...item, ...append }
            }

            return item
        })

        this.setState({ images }, () => {
            if ( finish ) finish(image)

            this.props.onChange(images)
        })
    }


    onSelected(uid) {
        this.setState({
            images: this.state.images.map(
                item => Object.assign({}, item, {
                    selected: item.uid === uid
                })
            )
        },
        () => this.props.onChange(
                this.state.images
            )
        )
    }


    openDialogue() {
        this.fileInput.current.click()
    }


    async uploadFiles (files) {
        for ( const file of files ) {
            try {
                const data = await this.checkFileAndBase64(file)

                const image = this.create({
                    data,
                    file,
                    source: data,
                    name: file.name,
                    size: bytesToSize(file.size)
                })

                this.setState({
                    images: [
                        image,
                        ...this.state.images
                    ]
                }, () => this.props.onChange(this.state.images))

                this.upload(image)
            } catch(e) {
                // nothing
            }            
        }
    }


    async checkFileAndBase64(file) {
        const {
            rules,
            accept,
        } = this.props,
        {
            images
        } = this.state

        

        /*
         * stop and send message
         *
        */
        const warning = key => {
            this.onWarning(key, { ...rules, accept, file })

            throw new Error();
        }

        if ( !isAccepted(file.type, accept.map(type => `image/${type}`)) ) {
            warning('accept')
        }

        const base64 = await getBase64(file)


        // if not available rules
        if ( rules !== null ) {
            const { size, limit, width, height } = rules
    
    
            /**
             * limit
             * 
            */
            if ( limit && images.length >= limit ) {
                warning('limit')
            }
    
    
            /**
             * size
             * 
            */
            if ( (size * 1024) < file.size ) {
                warning('size')
            }
    
    
            /**
             * dimensions
             * 
            */
            const image = await getImageDimensions(base64)
    
    
            if ( width ) {
                if ( image.width < width.min ) {
                    warning('minWidth')
                } else if ( image.width > width.max ) {
                    warning('maxWidth')
                }
            }
    
            if ( height ) {
                if ( image.height < height.min ) {
                    warning('minHeight')
                } else if ( image.height > height.max ) {
                    warning('maxHeight')
                }
            }
        }


        // all checked
        return base64
    }


    upload ({ uid, file, data }) {
        const { send, action, headers, customRequest } = this.props


        const request = customRequest || Request

        
        const { abort } = request({
            uid,
            file,
            action,
            headers,
            send: { data, ...send },


            onError: this.onError,
            onSuccess: this.onSuccess,
            onProgress: this.onProgress
        })

        this.setImage(uid, { abort })
    }


    setSort( images ) {
        this.setState({ images }, () => this.props.onChange(images))
    }


    render() {
        // states
        const { 
            images,
            renderComponent
        } = this.state


        // props
        const {
            className,
            
            style,
            accept,
            type,
            sorting,
           
            children,
            header,
            footer
        } = this.props


        const contextValue = {
            images,
            accept,
            setSort: this.setSort,
            uploadFiles: this.uploadFiles,
            openDialogue: this.openDialogue,
        }


        const options = {
            images,
            openDialogue: this.openDialogue,
        }


        // hide server side rendering
        if ( !renderComponent ) {
            return null
        }


        return <Context.Provider value={contextValue}>
            <div className={`ruig ${className}`} style={style}>
            
                {
                    header && (
                        header === true ? Handle(options) : header(options)
                    )
                }

                { 
                    typeof children === 'function' ? children(images, options) : View({ type, sorting }, images)
                }
                
                {
                    footer && (
                        footer === true ? Handle(options) : footer(options)
                    )
                }

                <input 
                    multiple
                    type="file"
                    ref={this.fileInput}
                    className="ruig-file-input"
                    accept={accept.map(type => `image/${type}`)}
                    onChange={event => this.uploadFiles(event.target.files)} />
            </div>
        </Context.Provider>
    }
}


RUIG.propTypes = propTypes
RUIG.defaultProps = defaultProps


export {
    List,
    Card,
    
    DragArea,
    DropArea
}


export default RUIG