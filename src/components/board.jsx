import React from "react";
import { Cell } from "./cell";
import { Overlay } from "./Overlay";
import PropTypes from "prop-types";



var dbg = console.log.bind(console, "DBG: ");


//Global variable for the timer
let timer = null;

// Board Class
export class Board extends React.Component {

  state = {
    boardData: this.initializeData(this.props.height, this.props.width),
    mineCount: this.props.mines,
    isFirstClick: true,
    clearCellsNum: (this.props.height * this.props.width) - this.props.mines,
    gameStatus: { isGameOver: false, isWon: false },
    totalSeconds: 0,
  };


  restartGame() {
    let props = this.props;
    clearInterval(timer);
    this.setState({
      boardData: this.initializeData(props.height, props.width),
      mineCount: props.mines,
      isFirstClick: true,
      clearCellsNum: (props.height * props.width) - props.mines,
      gameStatus: { isGameOver: false, isWon: false },
      totalSeconds: 0,
    });

  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.restartGame();
    }
  }

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


    //Gets the neighbours (all around) of a cell in position i,j uses a GENERATOR
    function* getNeighbourCells(i, j, data) {
      let temp_data = data;

      //Check left and make sure we are not in the left most side
      if (j !== 0) {
        yield temp_data[i][j - 1];
      }

      //Check top left and make sure we are not in the the left most side and not at the top
      if (j !== 0 && i !== 0) {
        yield temp_data[i - 1][j - 1];
      }

      //Check up and make sure we are not at the top
      if (i !== 0) {
        yield temp_data[i - 1][j];
      }

      //Check top right and make sure we are not in the the right most side and not at the top
      if (i !== 0 && j !== temp_data[i].length - 1) {
        yield temp_data[i - 1][j + 1];
      }

      //Check right and make sure we are not in the right most side
      if (j !== temp_data[i].length - 1) {
        yield temp_data[i][j + 1];
      }

      //Check bottom right and make sure we are not in the the right most side and not at the bottom
      if (i !== temp_data.length - 1 && j !== temp_data[i].length - 1) {
        yield temp_data[i + 1][j + 1];
      }

      //Check down and make sure we are not at the bottom
      if (i !== temp_data.length - 1) {
        yield temp_data[i + 1][j];
      }

      //Check bottom left and make sure we are not in the the left most side and not at the bottom
      if (i !== temp_data.length - 1 && j !== 0) {
        yield temp_data[i + 1][j - 1];
      }


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
      while (mines_planted < this.props.mines) {
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
      //If it has a number on it, reveal it, but nothing else beside it and make sure it is no longer flagged
      else if (data[i][j].neighbourMinesNum > 0) {
        data[i][j].isRevealed = true;
        data[i][j].isFlagged = false;
      }
      //If it is empty, reveal it, and get its neighbours and continue the process recursively and remove the flag attribute
      else {
        data[i][j].isRevealed = true;
        data[i][j].isFlagged = false;
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

    let getFlagsNum = (data) => {
      let num = 0;

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          if (data[i][j].isFlagged) {
            num++;
          }
        }
      }

      return num;
    }

    let isWon = (data) => {

      let revealed_so_far = 0;

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          if (data[i][j].isRevealed) {
            revealed_so_far++;
          }
        }
      }
      return this.state.clearCellsNum === revealed_so_far;
    }

    let updateTimer = () => {
      let new_timer = this.state.totalSeconds + 1;

      this.setState({ totalSeconds: new_timer });

    }

    //When we click on a cell for the first time, we need to populate the mines and assign numbers to cells
    if (this.state.isFirstClick) {
      //populate mines
      temp_data = populateMines(i, j, temp_data);
      //assign numbers to cells
      temp_data = assignNumbers(temp_data);
      //Update the global timer every second
      timer = setInterval(updateTimer, 1000);
      //Set the state to false, so we don't go here again
      this.setState({ boardData: temp_data, isFirstClick: false, });
    }

    if (!temp_data[i][j].isRevealed) {
      temp_data = revealArea(i, j, temp_data);
      let game_status = this.state.gameStatus;

      //Make sure we have not landed on a mine (if we did, it's game over)
      if (temp_data[i][j].isMine) {
        game_status.isGameOver = true;
        game_status.isWon = false;
        temp_data = revealBoard(temp_data);
        clearInterval(timer);
      }
      //Check winning condition, by checking if we have discovered all empty cells
      else if (isWon(temp_data)) {
        game_status.isGameOver = true;
        game_status.isWon = true;
        clearInterval(timer);
      }

      let mines_remain = this.props.mines - getFlagsNum(temp_data);
      //Update the board (and render)
      this.setState({ boardData: temp_data, mineCount: mines_remain, gameStatus: game_status });


    }





  }

  handleRightClickCell(e, i, j, data) {
    e.preventDefault();
    this.placeFlag(i, j, data);

  }

  placeFlag(i, j, data) {
    dbg("Placing FLAG at " + i + "," + j);
    let mines_remain = this.state.mineCount;

    if (!data[i][j].isRevealed) {
      if (data[i][j].isFlagged) {
        data[i][j].isFlagged = false;
        mines_remain++;
      }
      else {
        data[i][j].isFlagged = true;
        mines_remain--;
      }
    }

    //Update board data
    this.setState({ boardData: data, mineCount: mines_remain });
  }

  render() {

    let renderTable = (data) => {
      let temp_data = data;

      let rows = [];
      for (let i = 0; i < temp_data.length; i++) {
        let cell = [];
        for (let j = 0; j < temp_data[i].length; j++) {
          cell.push(
            <Cell
              onClick={() => this.handleLeftClickCell(i, j)}
              cMenu={(e) => this.handleRightClickCell(e, i, j, temp_data)}
              onLongClick={() => this.placeFlag(i, j, temp_data)}
              value={temp_data[i][j]}
            />
          )
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

    let renderOverlay = () => {
      const status = this.state.gameStatus
      if (status.isGameOver) {
        return <Overlay boardRestart={() => this.restartGame()} isWon={status.isWon} />
      }
      else {
        return null;
      }
    }

    /* adapted from https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript */
    let renderTimer = () => {
      let pad = (val) => {
        var valString = val + "";
        if (valString.length < 2) {
          return "0" + valString;
        } else {
          return valString;
        }
      }

      return (
        <div id="timer">
          <label> {pad(parseInt(this.state.totalSeconds / 60))}: </label>
          <label>{pad(this.state.totalSeconds % 60)}</label>
        </div>
      );
    }

    return (
      <div>
        {renderOverlay()}
        {renderTimer()}
        {renderTable(this.state.boardData)}
        <div className="game-info">
          <span className="info">Mines remaining: {this.state.mineCount}</span>
        </div>

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
