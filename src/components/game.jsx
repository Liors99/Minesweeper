import React from "react";
import { Board } from "./board";

// Game Class
export class Game extends React.Component {
  state = {
    height: 10,
    width: 10,
    mines: 10,
  };

  render() {
    const { height, width, mines } = this.state;
    return (
      <div className="game">
        <Board height={height} width={width} mines={mines} />
      </div>
    );
  }
}
