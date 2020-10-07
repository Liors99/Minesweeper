import React from "react";
import { Cell } from "./cell";
import PropTypes from "prop-types";


var dbg = console.log.bind(console, "DBG: ");

// Board Class
export class Board extends React.Component {
  state = {
    boardData: this.initializeData(this.props.height, this.props.width),
    gameStatus: "Game in progress",
    mineCount: this.props.mines,
    isFirstClick: true,
  };

  initializeData(height, width) {
    let data = [];

    for (let i = 0; i < height; i++) {
      data.push([]);
      for (let j = 0; j < width; j++) {
        data[i][j] = {
          i: i,
          j: j,
          isMine: false,
          neighbourMinesNum: 0,
          isRevealed: false,
          isFlagged: false,
        };
      }
    }
    return data;
  }

  //Handles what happens when we left click on a cell, requires the the position of the cell
  handleLeftClickCell(i, j) {

    let temp_data = this.state.boardData;

    dbg("Clicked on cell " + i + "," + j);


    //Gets the neighbours (all around) of a cell in position i,j
    let getNeighbourCells = (i, j, data) => {
      let temp_data = data;
      let neighbours = [];

      //Check left and make sure we are not in the left most side
      if (j !== 0) {
        neighbours.push(temp_data[i][j - 1]);
      }

      //Check top left and make sure we are not in the the left most side and not at the top
      if (j !== 0 && i !== 0) {
        neighbours.push(temp_data[i - 1][j - 1]);
      }

      //Check up and make sure we are not at the top
      if (i !== 0) {
        neighbours.push(temp_data[i - 1][j]);
      }

      //Check top right and make sure we are not in the the right most side and not at the top
      if (i !== 0 && j !== temp_data[i].length - 1) {
        neighbours.push(temp_data[i - 1][j + 1]);
      }

      //Check right and make sure we are not in the right most side
      if (j !== temp_data[i].length - 1) {
        neighbours.push(temp_data[i][j + 1]);
      }

      //Check bottom right and make sure we are not in the the right most side and not at the bottom
      if (i !== temp_data.length - 1 && j !== temp_data[i].length - 1) {
        neighbours.push(temp_data[i + 1][j + 1]);
      }

      //Check down and make sure we are not at the bottom
      if (i !== temp_data.length - 1) {
        neighbours.push(temp_data[i + 1][j]);
      }

      //Check bottom left and make sure we are not in the the left most side and not at the bottom
      if (i !== temp_data.length - 1 && j !== 0) {
        neighbours.push(temp_data[i + 1][j - 1]);
      }

      return neighbours;

    }

    let populateMines = (i, j, data) => {
      let temp_data = data;

      //Returns a number integer in range (from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
      let getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
      }

      let mines_planted = 0;
      while (mines_planted < this.state.mineCount) {
        //Generate random i and j
        let i_mine = getRandomIntInclusive(0, temp_data.length - 1);
        let j_mine = getRandomIntInclusive(0, temp_data[0].length - 1);

        if (i !== i_mine && j !== j_mine && !temp_data[i_mine][j_mine].isMine) {
          temp_data[i_mine][j_mine].isMine = true;
          mines_planted++;

          dbg("Planted a mine at " + i_mine + ", " + j_mine);
        }
      }

      return temp_data;

    }

    let assignNumbers = (data) => {

      let temp_data = data;

      for (let i = 0; i < temp_data.length; i++) {
        for (let j = 0; j < temp_data[i].length; j++) {

          for (let neighbour of getNeighbourCells(i, j, temp_data)) {
            if (neighbour.isMine) {
              temp_data[i][j].neighbourMinesNum++;
            }
          }


        }
      }



      return temp_data;

    }

    //Recursively reveals every non empty connecting cell
    let revealArea = (i, j, data) => {
      //If it is a mine or has already been revealed, "skip"
      if (data[i][j].isMine || data[i][j].isRevealed) {
      }
      //If it has a number on it, reveal it, but nothing else beside it
      else if (data[i][j].neighbourMinesNum > 0) {
        data[i][j].isRevealed = true;
      }
      //If it is empty, reveal it, and get its neighbours and continue the process recursively
      else {
        data[i][j].isRevealed = true;
        for (let neighbour of getNeighbourCells(i, j, temp_data)) {
          revealArea(neighbour.i, neighbour.j, data);
        }
      }

      return data;
    }

    let revealBoard = (data) => {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          data[i][j].isRevealed = true;
        }
      }

      return data;
    }

    //When we click on a cell for the first time, we need to populate the mines and assign numbers to cells
    if (this.state.isFirstClick) {
      //populate mines
      temp_data = populateMines(i, j, temp_data);
      //assign numbers to cells
      temp_data = assignNumbers(temp_data);
      //Set the state to false, so we don't go here again
      this.setState({ boardData: temp_data, isFirstClick: false });
    }


    temp_data = revealArea(i, j, temp_data);

    //Make sure we have not landed on a mine
    if (temp_data[i][j].isMine) {
      alert("Game over");
      temp_data = revealBoard(temp_data);
    }

    //TODO: Update the board (and render)
    this.setState({ boardData: temp_data });




  }

  handleRightClickCell(e, i, j, data) {
    e.preventDefault();

    if (!data[i][j].isRevealed) {
      if (data[i][j].isFlagged) {
        data[i][j].isFlagged = false;
      }
      else {
        data[i][j].isFlagged = true;
      }
    }

    //Update board data
    this.setState({ boardData: data });

  }

  render() {

    let renderTable = (data) => {
      let temp_data = data;

      let rows = [];
      for (let i = 0; i < temp_data.length; i++) {
        let cell = [];
        for (let j = 0; j < temp_data[i].length; j++) {
          cell.push(<td key={"r" + i + "c" + j}>
            <Cell
              onClick={() => this.handleLeftClickCell(i, j)}
              cMenu={(e) => this.handleRightClickCell(e, i, j, temp_data)}
              value={temp_data[i][j]}
            />
          </td>)
        }
        rows.push(<tr key={"r" + i}>{cell}</tr>)
      }

      return (
        <table id="game-board">
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    }

    return (
      <div className="board">
        <div className="game-info">
          <h1 className="info">{this.state.gameStatus}</h1>
          <span className="info">Mines remaining: {this.state.mineCount}</span>
        </div>

        {renderTable(this.state.boardData)}

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
