import React from "react";
import { Board } from "./board";

// Game Class
export class Game extends React.Component {
  state = {
    height: 16,
    width: 16,
    mines: 40,
    currentDifficulty: "m",
  };

  // Changes the current difficuly level and sets the current difficulty
  changeDifficulty(h, w, m, difficulty) {
    this.setState({ height: h, width: w, mines: m, currentDifficulty: difficulty });
  }

  //Gets the classname (for css) for the buttons and decides which one is the active one depending on the currentDifficulty
  btnGetClassName(difficulty) {
    let name = "menuButton";
    if (difficulty === this.state.currentDifficulty) {
      name = name + " menuButton-select";
    }
    return name;
  }

  render() {
    return (
      <div>
        <div className="menu">
          <div className={this.btnGetClassName("e")} onClick={() => this.changeDifficulty(9, 9, 10, "e")} > Easy </div>
          <div className={this.btnGetClassName("m")} onClick={() => this.changeDifficulty(16, 16, 40, "m")} > Medium </div>
          <div className={this.btnGetClassName("h")} onClick={() => this.changeDifficulty(22, 22, 99, "h")} > Hard </div>
        </div>
        <Board height={this.state.height} width={this.state.width} mines={this.state.mines} />
      </div>

    );
  }
}
