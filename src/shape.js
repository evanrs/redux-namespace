import PropTypes from 'prop-types';

export const shape = {
  assign: PropTypes.func.isRequired,
  assigns: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  cursor: PropTypes.func.isRequired,
  defaults: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  resets: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  selects: PropTypes.func.isRequired,
  touched: PropTypes.func.isRequired,
  version: PropTypes.func.isRequired,
}

export default shape
