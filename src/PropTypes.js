import PropTypes from "prop-types";

const func = () => {};

export const defaultProps = {
  action: "",
  className: "",

  inOrder: false,
  ssrSupport: false,
  autoUpload: true,

  send: {},
  headers: {},
  style: {},

  accept: ["jpg", "jpeg", "png", "gif"],
  acceptType: "image",
  initialState: [],

  type: "card",

  sorting: true,
  header: true,
  footer: false,

  rules: null,

  customRequest: null,
  source: null,

  onSuccess: func,
  onWarning: func,
  onDeleted: func,
  onChange: func,
  onError: func,
  onClick: func,
  onConfirmDelete: () => true,
};

export const propTypes = {
  action: PropTypes.string,
  className: PropTypes.string,

  inOrder: PropTypes.bool,
  ssrSupport: PropTypes.bool,
  autoUpload: PropTypes.bool,

  send: PropTypes.object,
  headers: PropTypes.object,
  style: PropTypes.object,

  initialState: PropTypes.arrayOf(PropTypes.object),

  type: PropTypes.oneOf(["card", "list"]),

  sorting: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),

  header: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.func,
  ]),

  footer: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.func,
  ]),

  rules: PropTypes.shape({
    size: PropTypes.number,
    limit: PropTypes.number,
    width: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    height: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
  }),

  customRequest: PropTypes.func,
  source: PropTypes.func,

  onSuccess: PropTypes.func,
  onWarning: PropTypes.func,
  onDeleted: PropTypes.func,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  onClick: PropTypes.func,
  onConfirmDelete: PropTypes.func,

  acceptType: PropTypes.string,
  accept: PropTypes.array,
};
