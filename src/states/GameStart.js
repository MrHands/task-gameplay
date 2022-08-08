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

Due to a series of _hilarious_ mishaps that would take too long to get into
here, you have been put in charge of the space ship _Love Itself_. This vessel
has a prototype engine installed, called the _S.E.X. drive_, which is powered by
sexual energy, or **sexergy**.

Your goal as the male **Captain** of the ship is to collect as much sexergy as
possible from your three female **Crew Members** to keep the S.E.X. drive
purring and the ship sailing through space.

## Day shift

Crew members have three different stats they need to grow: **Passionate**,
**Intimate**, and **Submissive**. These are primarily used in the _Night_ shift.

At the beginning of the _Morning_, _Afternoon_, and _Evening_ shifts, you will
be given five random **Action Dice**. These are used to perform **Tasks** by
your crew members and yourself.

Your crew members will assign themselves to different locations on the ship.
Each location has different **Tasks** that a crew member can perform, and each
task will have different requirements:

* **Gates** display a big number; you must drag in one or more Action Dice
to whittle this down to 0.

* **Tools** have a dotted outline and can be started with any Action Dice.

* **Min/Max** tasks require a minimum or maximum number of eyes on your die,
respectively.

Captain tasks also cost **Stamina**, which replenishes on the next day.

You can advance to the next shift at any time, which will shuffle your crew
members to new locations and refresh your hand with new Action Dice.

## Night shift

At the start of the night shift, you pick a crew member to have sex with. You
can then perform sex moves to generate **sexergy**. The arousal you've built up
during the day shifts is taken into this shift.

When the crew member's lust bar reaches 200% arousal, they have an orgasm. This
doubles the sexergy you've generated so far.

When the captain's lust bar reaches 100%, the night shift ends. The generated
sexergy is added to the total.

Have fun!
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