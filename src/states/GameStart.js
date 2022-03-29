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
				<div className="o-gameStart__explain">
					<ReactMarkdown>
{`# Up There They Love - Gameplay Prototype

Due to a series of _hilarious_ mishaps that would take too long to get into here,
you have been put in charge of the space ship _Love Itself_. This vessel has a prototype
engine installed, called the **S.E.X. drive**, and is powered by **sexual energy**, or _sexergy_.

As the **captain**, it is your responsibility to **manage** your **crew members** by assigning **tasks**
to them during their shifts. You need to generate as much **sexergy** as possible so the ship can
keep flying!

## Day shift

During the _Morning_, _Afternoon_, and _Evening_ shifts, you assign each crew member to a task.
The tasks have a **difficulty** and the crew member rolls a 1d20 to determine if they succeed, fail,
or have a critical success. You can **bet crew stamina** to improve your odds. But be careful!
Characters without any stamina remaining can only perform a _Rest_ task to restore it.

## Night shift

At the start of the _Night_, you pick a crew member to have sex with. You can then perform sex moves to
generate **sexergy**.

When the crew member's lust bar reaches 200%, they orgasm. This doubles the sexergy you've generated so far.

When the captain's lust bar reaches 100%, the night shift ends. The generated sexergy is added to the total.
`}
					</ReactMarkdown>
				</div>
				<div className="o-gameStart__interact">
					<button onClick={onStartGame}>Start Game</button>
					<button onClick={onJumpToNight}>Skip To Night Shift</button>
				</div>
			</article>
		);
	}
}