import React from "react";
import { Board } from "./board";

// Game Class
export class Game extends React.Component {
  state = {
    height: 10,
    width: 15,
    mines: 10,
  };

  changeDifficulty(h, w, m) {
    this.setState({ height: h, width: w, mines: m });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.changeDifficulty(5, 10, 5)}> Easy </button>
        <button onClick={() => this.changeDifficulty(10, 15, 10)}> Medium </button>
        <Board height={this.state.height} width={this.state.width} mines={this.state.mines} />
      </div>

    );
  }
}
