import React from 'react';

export default class GameStart extends React.Component {
	render() {
		const {
			onStartGame
		} = this.props;

		return (
			<article className='o-gameStat'>
				<button onClick={onStartGame}>Start Game</button>
			</article>
		);
	}
}