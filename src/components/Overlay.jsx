import React from 'react';
import PropTypes from "prop-types";

export class Overlay extends React.Component {
    state = {
        hasWon: this.props.isWon,
        isVisible: true
    }

    //Handles what happens when we click on the overlay
    handleOnClick() {
        //Restart the board and toggle its visibility
        this.props.boardRestart();
        this.setState({ isVisible: !this.state.isVisible });
    }

    render() {

        if (this.state.isVisible) {
            const text_colour = this.state.hasWon ? "lime" : "red";
            return (
                <div id="overlay" onClick={this.handleOnClick.bind(this)}>
                    <div className="overlay-content">
                        <h1 style={{ color: text_colour }}> You {this.state.hasWon ? "won!" : "lost"}</h1>
                        <p>Click anywhere to play again</p>
                    </div>

                </div >
            );
        }
        else {
            return null;
        }



    }
}

Overlay.propTypes = {
    boardRestart: PropTypes.func,
    isWon: PropTypes.bool,
};