import React from 'react';

import './GameStart.scss';

export default class GameStart extends React.Component {
	render() {
		const {
			onStartGame,
			onJumpToNight
		} = this.props;

		return (
			<article className='o-gameStart'>
				<button onClick={onStartGame}>Start Game</button>
				<button onClick={onJumpToNight}>Jump Straight To Night Shift</button>
			</article>
		);
	}
}