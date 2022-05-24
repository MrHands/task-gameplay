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
engine installed, called the _S.E.X. drive_, which is powered by sexual energy, or **sexergy**.

Your goal as the male **Captain** of the ship is to collect as much sexergy as possible from
your three female **Crew Members** to keep the S.E.X. drive purring and the ship sailing through
space.

## Day shift

During the _Morning_, _Afternoon_, and _Evening_ shifts, your crew members will assign themselves
to different locations on the ship. Each location has **Tasks** that a crew member can perform, which
cost **Stamina**. Some tasks will give them **Arousal**, which will help you during the _Night_ shift.

As the captain, you decide which tasks your crew members will perform. Tasks have a difficulty that
must first be whittled down by dragging your **Action Dice** into them. You can drag more than one
Action Dice into the same task.

Once a task reaches 0 difficulty, you have unlocked it for this shift.

Most tasks cost Stamina to perform, but the **Rest** action is
different: it restores Stamina for the number of eyes on the Action Dice that you assign.
E.g., assigning a 4 will restore 4 stamina for the crew member.

You can advance to the next shift at any time, which will shuffle your crew members to new locations
and refresh your hand with new Action Dice.

## Night shift

At the start of the night shift, you pick a crew member to have sex with. You can then perform
sex moves to generate **sexergy**. The arousal you've built up during the day shifts is taken into
this shift.

When the crew member's lust bar reaches 200% arousal, they have an orgasm. This doubles the sexergy
you've generated so far.

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