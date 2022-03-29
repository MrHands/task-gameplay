import React from 'react';

import CharacterList from '../components/CharacterList';
import DroppableCard from '../components/DroppableCard';

import './NightPlayArea.scss';
import NightLog from './NightLog';

export default class NightPlayArea extends React.Component {
	get classes() {
		const {
			className,
			nightCharacter
		} = this.props;

		const classes = ['m-nightPlayArea'];

		if (nightCharacter !== null) {
			classes.push('-playing');
		}

		classes.push(className);

		return classes;
	}

	render() {
		const {
			charactersUnplaced,
			nightCharacter,
			nightTask,
			nightLog,
			clampCharacterStat,
			onCharacterDropped,
			canBePlaced,
		} = this.props;

		if (nightCharacter !== null) {
			return (
				<div className={this.classes.join(' ')}>
					<NightLog
						className="m-nightPlayArea__log"
						nightLog={nightLog}
					/>
				</div>
			)
		} else {
			return (
				<div className={this.classes.join(' ')}>
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