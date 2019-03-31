import PropTypes from 'prop-types'


const func = () => {}


export const defaultProps = {
    action: '',
    className: '',

    ssrSupport: false,
    
    send: {},
    headers: {},
    style: {},

    accept: ['jpg', 'jpeg', 'png', 'gif'],
    initialState: [],

    type: 'card',

    sorting: true,
    header: true,
    footer: false,

    rules: null,

    customRequest: null,
    source: null,

    onSuccess: func,
    onMessage: func,
    onWarning: func,
    onDeleted: func,
    onChange: func,
    onError: func,
    onClick: func,
    onConfirmDelete: () => true,

}


export const propTypes = {
    action: PropTypes.string,
    className: PropTypes.string,

    ssrSupport: PropTypes.bool,

    send: PropTypes.object,
    headers: PropTypes.object,
    style: PropTypes.object,

    initialState: PropTypes.arrayOf(PropTypes.object),

    type: PropTypes.oneOf(['card', 'list']),

    sorting: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),

    header: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.func
    ]),

    footer: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.func
    ]),

    rules: PropTypes.shape({
        size: PropTypes.number,
        limit: PropTypes.number,
        width: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number
        }),
        height: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number
        })
    }),

    customRequest: PropTypes.func,
    source: PropTypes.func,

    onSuccess: PropTypes.func,
    onWarning: PropTypes.func,
    onDelete: PropTypes.func,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    onClick: PropTypes.func,
    onConfirmDelete: PropTypes.func,


    accept: PropTypes.arrayOf((values, key, componentName, location, fullName) => {
        const extensions = ['jpg', 'jpeg', 'png', 'gif']

        for ( const value of values ) {
            if ( extensions.indexOf(value) === -1 ) {
                return new Error(
                    `Invalid prop '${fullName}' supplied to '${componentName}'. Validation failed. Only '${extensions.join(',')}'`
                );
            }
        }
    })
}