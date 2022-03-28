import React from 'react';

import CharacterList from '../components/CharacterList';
import DroppableCard from '../components/DroppableCard';
import ShiftHud from './ShiftHud';

import './NightPlayArea.scss';

export default class NightPlayArea extends React.Component {
	render() {
		const {
			day,
			shift,
			charactersNotDone,
			charactersUnplaced,
			nightCharacter,
			nightTask,
			nightLog,
			clampCharacterStat,
			onCharacterDropped,
			canBePlaced,
			handleFinishShift
		} = this.props;

		const classes = ['m-nightPlayArea'];
		if (nightCharacter !== null) {
			classes.push('-playing');
		}
		classes.push(this.props.className);

		if (nightCharacter !== null) {
			return (
				<div className={classes.join(' ')}>
					<ul className="m-nightPlayArea__log">
						{nightLog.map(entry => {
							return <li>{entry}</li>;
						})}
					</ul>
				</div>
			)
		} else {
			return (
				<div className={classes.join(' ')}>
					<ShiftHud
						className="m-nightPlayArea__hud"
						day={day}
						shift={shift}
						charactersNotDone={charactersNotDone}
						handleFinishShift={handleFinishShift}
					/>
					<div className="m-nightPlayArea__drop">
						<DroppableCard
							className="o-character -empty"
							task={nightTask}
							onCharacterDropped={onCharacterDropped}
							canBePlaced={canBePlaced}
						>
							<h3 className="o-character__title">Drag character here</h3>
						</DroppableCard>
					</div>
					<CharacterList
						className="m-nightPlayArea__characters -night"
						characters={charactersUnplaced}
						clampCharacterStat={clampCharacterStat}
						canBePlaced={canBePlaced}
					/>
				</div>
			)
		}
	}
}