import React from "react";
import { Cell } from "./cell";
import PropTypes from "prop-types";

// Board Class
export class Board extends React.Component {
  state = {
    boardData: this.initBoardData(
      this.props.height,
      this.props.width,
      this.props.mines
    ),
    gameStatus: "Game in progress",
    mineCount: this.props.mines,
  };

  // Gets initial board data
  initBoardData(height, width, mines) {
    let data = this.createEmptyArray(height, width);
    return data;
  }

  createEmptyArray(height, width) {
    let data = [];

    for (let i = 0; i < height; i++) {
      data.push([]);
      for (let j = 0; j < width; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
        };
      }
    }
    return data;
  }

  renderTable(data) {

    let rows = [];
    for (var i = 0; i < this.props.height; i++) {
      let cell = [];
      for (var j = 0; j < this.props.width; j++) {
        cell.push(<td>
          <Cell
            onClick={() => console.log("left clicked")}
            cMenu={(e) => console.log("right clicked")}
            value={data[i][j]}
          />
        </td>)
      }
      rows.push(<tr>{cell}</tr>)
    }

    return (
      <table id="game-board">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="board">
        <div className="game-info">
          <h1 className="info">{this.state.gameStatus}</h1>
          <span className="info">Mines remaining: {this.state.mineCount}</span>
        </div>

        {this.renderTable(this.state.boardData)}

      </div>
    );
  }
}

// Type checking With PropTypes
Board.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  mines: PropTypes.number,
};
