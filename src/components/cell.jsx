import React from "react";
import PropTypes from "prop-types";

// Cell Class
export class Cell extends React.Component {
  getValue() {
    const { value } = this.props;

    if (!value.isRevealed) {
      return this.props.value.isFlagged ? "🚩" : null;
    }
    if (value.isMine) {
      return "💣";
    }
    if (value.neighbour === 0) {
      return null;
    }
    return value.neighbour;
  }

  render() {
    const { value, onClick, cMenu } = this.props;
    return (
      <div onClick={onClick} className="cell hidden" onContextMenu={cMenu}>
        {this.getValue()}
      </div>
    );
  }
}

// Type checking With PropTypes
const cellItemShape = {
  isRevealed: PropTypes.bool,
  isMine: PropTypes.bool,
  isFlagged: PropTypes.bool,
};

Cell.propTypes = {
  value: PropTypes.objectOf(PropTypes.shape(cellItemShape)),
  onClick: PropTypes.func,
  cMenu: PropTypes.func,
};
