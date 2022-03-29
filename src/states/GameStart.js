import React from 'react';
import ReactMarkdown from 'react-markdown';

import './GameStart.scss';

export default class GameStart extends React.Component {
	render() {
		const {
			onStartGame,
			onJumpToNight
		} = this.props;

		return (
			<article className='o-gameStart'>
				<div class="o-gameStart__explain">
					<ReactMarkdown>
{`# Up There They Love - Gameplay Prototype

Due to a series of _hilarious_ mishaps that would take too long to get into here,
you have been put in charge of the space ship _Love Itself_.`}
					</ReactMarkdown>
				</div>
				<div class="o-gameStart__interact">
					<button onClick={onStartGame}>Start Game</button>
					<button onClick={onJumpToNight}>Skip To Night Shift</button>
				</div>
			</article>
		);
	}
}