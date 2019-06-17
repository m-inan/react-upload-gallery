import React from 'react'
import { defaultProps, propTypes } from './PropTypes'

import Handle from './Handle'
import Context from './Context'
import Request from './Request'
import View from './view'
import uuuidv4 from 'uuuid/v4';

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
        const uuid = uuuidv4()

        item = {
            uuid,
            done: false,
            error: false,
            uploading: false,
            progress: 0,
            refresh: () => {},
            abort: () => {},
            remove: () => this.remove(uuid),
            click: () => this.onClick(uuid),
            select: () => this.onSelected(uuid),
            upload: data => this.tryUpload(uuid, data),
            ...item
        }

        this.props.onCreated(item)

        return item
    }

    refresh(uuid, data) {
        this.setImage(
            uuid,
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

    async tryUpload(uuid, file) {
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
                uuid,
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

    async remove(uuid) {
        const { images } = this.state; let deletedImage;

        for ( const key in images ) {
            const image = images[key]

            if ( image.uuid === uuid ) {
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

    onProgress(uuid, percentage) {
        this.setImage(uuid, { progress: isNaN(percentage) ? 0 : percentage })
    }

    onSuccess(uuid, response) {
        let { source } = this.props

        source = (
            typeof source === 'function' ? source(response) : response.source
        )

        this.setImage(
            uuid,
            {
                source,
                done: true,
                error: false,
                uploading: false,
                progress: 100
            },
            () => this.props.onSuccess(this.state.images.find(item => item.uuid === uuid))
        )
    }

    onError(uuid, { status, response }) {
        this.setImage(
            uuid,
            {
                status,
                error: true,
                uploading: false,
                refresh: data => this.refresh(uuid, data)
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

    onClick(uuid) {
        this.props.onClick(
            this.state.images.find(
                image => image.uuid === uuid
            )
        )
    }

    onWarning(key, rules) {
        this.props.onWarning(key, rules)
    }

    setImage(uuid, append, finish) {
        let image, { images } = this.state

        images = images.map(item => {
            if ( item.uuid === uuid ) {
                return image = { ...item, ...append }
            }

            return item
        })

        this.setState({ images }, () => {
            if ( finish ) finish(image)

            this.props.onChange(images)
        })
    }

    onSelected(uuid) {
        this.setState({
            images: this.state.images.map(
                item => Object.assign({}, item, {
                    selected: item.uuid === uuid
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

    upload ({ uuid, file, data }) {
        const { send, action, headers, customRequest } = this.props

        const request = customRequest || Request

        const { abort } = request({
            uuid,
            file,
            data,
            send,
            action,
            headers,

            onError: this.onError,
            onSuccess: this.onSuccess,
            onProgress: this.onProgress
        })

        this.setImage(uuid, { abort, uploading: true })
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
