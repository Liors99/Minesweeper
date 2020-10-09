import React from "react";
import { Board } from "./board";

// Game Class
export class Game extends React.Component {
  state = {
    height: 16,
    width: 16,
    mines: 40,
  };

  changeDifficulty(h, w, m) {
    this.setState({ height: h, width: w, mines: m });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.changeDifficulty(9, 9, 10)}> Easy </button>
        <button onClick={() => this.changeDifficulty(16, 16, 40)}> Medium </button>
        <button onClick={() => this.changeDifficulty(16, 30, 99)}> Hard </button>
        <Board height={this.state.height} width={this.state.width} mines={this.state.mines} />
      </div>

    );
  }
}
