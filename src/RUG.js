import React from 'react'
import { defaultProps, propTypes } from './PropTypes'

import Handle from './Handle'
import Context from './Context'
import Request from './Request'
import View from './view'

import {
    bytesToSize,
    isAccepted,
    getImageDimensions
} from './Utils'


class RUG extends React.Component {

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

        item = {
            uid,
            done: false,
            error: false,
            uploading: false,
            progress: 0,
            refresh: () => {},
            abort: () => {},
            remove: () => this.remove(uid),
            click: () => this.onClick(uid),
            select: () => this.onSelected(uid),
            upload: data => this.tryUpload(uid, data),
            ...item
        }

        return item
    }

    refresh(uid, data) {
        this.setImage(
            uid,
            {
                error: false,
                done: false,
                progress: 0
            },
            image => {
                this.upload(image)
            }
        )
    }

    async tryUpload(uid, file) {
        let changes = {}

        try {
            if ( file instanceof Blob ) {
                const source = await this.getImageURLToBlob(file)
    
                changes = {
                    file,
                    source
                }
            }
    
            this.setImage(
                uid,
                {
                    ...changes,
                    error: false,
                    done: false,
                    progress: 0
                },
                image => this.upload(image)
            )
        } catch (e) {

        }
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

    onProgress(uid, percentage) {
        this.setImage(uid, { progress: isNaN(percentage) ? 0 : percentage })
    }

    onSuccess(uid, response) {
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
                uploading: false,
                progress: 100
            }, 
            () => this.props.onSuccess(this.state.images.find(item => item.uid === uid))
        )
    }

    onError(uid, { status, response }) {
        this.setImage(
            uid, 
            {
                status,
                error: true,
                uploading: false,
                refresh: data => this.refresh(uid, data)
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
        const images = []
        

        for ( const file of files ) {
            try {
                const source = await this.getImageURLToBlob(file, images)

                const image = this.create({
                    file,
                    source,
                    name: file.name,
                    size: bytesToSize(file.size)
                })

                images.push(image)
            } catch(e) {
                // nothing
            }
        }

        this.setState({
            images: images.concat(this.state.images)
        }, () => {
            if ( this.props.autoUpload ) {
                images.forEach(image => this.upload(image))
            }

            this.props.onChange(this.state.images)
        })
    }

    async getImageURLToBlob(file, images = []) {
        const {
            rules,
            accept,
        } = this.props

        images = images.concat(this.state.images)

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

        const ImageURL = URL.createObjectURL(file)

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
            const image = await getImageDimensions(ImageURL)
    
    
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
        return ImageURL
    }

    upload ({ uid, file, data }) {
        const { send, action, headers, customRequest } = this.props

        const request = customRequest || Request
        
        const { abort } = request({
            uid,
            file,
            data,
            send,
            action,
            headers,

            onError: this.onError,
            onSuccess: this.onSuccess,
            onProgress: this.onProgress
        })

        this.setImage(uid, { abort, uploading: true })
    }

    setSort( images ) {
        this.setState({ images }, () => this.props.onChange(images))
    }

    showChildren(options) {
        const { type, sorting, children } = this.props, { images } = this.state

        switch(typeof children) {
            case 'object':
                return children;
            case 'function':
                return children(images, options)
            default: 
                return View({ type, sorting }, images)
        }
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

            header,
            footer
        } = this.props

        const contextValue = {
            images,
            accept,
            autoUpload: this.props.autoUpload,
            setSort: this.setSort,
            uploadFiles: this.uploadFiles,
            openDialogue: this.openDialogue
        }, 
        options = contextValue


        // hide server side rendering
        if ( !renderComponent ) {
            return null
        }

        return <Context.Provider value={contextValue}>
            <div className={`rug ${className}`} style={style}>

                {
                    header && (
                        typeof header === 'function' ? header(options) : Handle(options, header)
                    )
                }

                { this.showChildren(options) }
                
                {
                    footer && (
                        typeof footer === 'function' ? footer(options) : Handle(options, footer)
                    )
                }

                <input
                    multiple
                    type="file"
                    ref={this.fileInput}
                    className="rug-file-input"
                    accept={accept.map(type => `image/${type}`)}
                    onChange={event => this.uploadFiles(event.target.files)} />
            </div>
        </Context.Provider>
    }
}

RUG.propTypes = propTypes
RUG.defaultProps = defaultProps

export default RUG