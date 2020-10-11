import React from 'react';

export class Menu extends React.Component {
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
            return (
                <div id="overlay" onClick={this.handleOnClick.bind(this)}>
                    <div className="overlay-content">
                        <h1> You {this.state.hasWon ? "won!" : "lost"}</h1>
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