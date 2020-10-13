import React from "react";
import PropTypes from "prop-types";

let pressTimer;

// Cell Class
export class Cell extends React.Component {
  //Gets the value from the props (i.e. what to display)
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

  /* Touch start and touch end functions are used for hold detection, taken from https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone */

  touchstart() {
    if (!pressTimer) {
      pressTimer = setTimeout(() => { pressTimer = null; this.props.onLongTouch(); }, 1000);
    }

  }

  touchend() {
    //stops short touches from firing the event
    if (pressTimer) {
      clearTimeout(pressTimer); // clearTimeout, not cleartimeout..
      pressTimer = null;
    }
  }

  render() {
    const { onClick, cMenu, rightClick, value } = this.props;
    const cell_class = "cell-content " + (value.isRevealed ? "" : "hidden");
    return (
      <td onClick={onClick} className="cell" onTouchStart={this.touchstart.bind(this)} onTouchEnd={this.touchend} onMouseDown={rightClick} onContextMenu={cMenu}>
        <div className={cell_class}>
          <div className="innerTable">
            <div className="innerTable-cell">
              {this.getValue()}
            </div>
          </div>

        </div>

      </td>
    );
  }
}

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
  rightClick: PropTypes.func,
  onLongTouch: PropTypes.func,
};



