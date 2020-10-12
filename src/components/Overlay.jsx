import React from 'react';

export class Overlay extends React.Component {
    state = {
        hasWon: this.props.isWon,
        isVisible: true
    }

    handleOnClick() {
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