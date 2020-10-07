import React from "react";
import PropTypes from "prop-types";

var dbg = console.log.bind(console, "DBG: ");

// Cell Class
export class Cell extends React.Component {
  getValue() {
    const { value } = this.props;

    if (!value.isRevealed) {
      return this.props.value.isFlagged ? "🚩" : null;
    }
    else if (value.isMine) {
      return "💣";
    }
    else if (value.neighbourMinesNum === 0) {
      return null;
    }
    return value.neighbourMinesNum;
  }

  render() {
    const { value, onClick, cMenu } = this.props;
    const cell_class = "cell " + (value.isRevealed ? "" : "hidden");
    return (
      <div onClick={onClick} className={cell_class} onContextMenu={cMenu}>
        {dbg("Drawing cell with value " + this.getValue())}
        {this.getValue()}
      </div>
    );
  }
}

// Type checking With PropTypes
const cellItemShape = {
  i: PropTypes.numer,
  j: PropTypes.numer,
  neighbourMinesNum: PropTypes.numer,
  isRevealed: PropTypes.bool,
  isMine: PropTypes.bool,
  isFlagged: PropTypes.bool,
};

Cell.propTypes = {
  value: PropTypes.objectOf(PropTypes.shape(cellItemShape)),
  onClick: PropTypes.func,
  cMenu: PropTypes.func,
};
