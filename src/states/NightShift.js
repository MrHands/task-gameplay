import React from 'react';

import Character from '../components/Character';
import CharacterList from '../components/CharacterList';
import DroppableCard from '../components/DroppableCard';
import LustBar from '../components/LustBar';
import SexMove from '../components/SexMove';
import SexMoveCategory from '../components/SexMoveCategory';

import './NightShift.scss';

export default class NightShift extends React.Component {
	constructor() {
		super();

		this.state = {
			sexergyEarned: 0,
		};
	}

	playSexMove(sexMoveId) {
		this.props.playSexMove(sexMoveId);

		this.setState(state => {
			const {
				sexergyEarned
			} = state;

			const sexMove = this.props.getSexMove(sexMoveId);
			const sexergyEffect = sexMove.effects.find(effect => effect.type === 'sexergy');

			return {
				sexergyEarned: sexergyEarned + sexergyEffect.value
			};
		});
	}

	renderCharacters(props) {
		const {
			nightCharacter,
			charactersUnplaced,
			clampCharacterStat,
			canBePlaced,
		} = props;

		if (nightCharacter !== null) {
			return null;
		}

		return (
			<CharacterList
				className="o-nightShift__interact"
				characters={charactersUnplaced}
				clampCharacterStat={clampCharacterStat}
				canBePlaced={canBePlaced}
			/>
		);
	}

	renderSelected(props, movesSelected) {
		const {
			nightCharacter,
			canSexMoveBePlayed
		} = props;

		if (nightCharacter === null) {
			return <div className="o-nightShift__selected" />;
		}

		return (
			<div className="o-nightShift__selected">
				{movesSelected.map((sexMove, index) => {
					return (
						<SexMove
							key={`selected-move-${index}`}
							canSexMoveBePlayed={canSexMoveBePlayed}
							{...sexMove}
						/>
					);
				})}
			</div>
		);
	}

	render() {
		const {
			nightLog,
			nightTask,
			nightCharacter,
			lust,
			sexMoves,
			sexMovesPlayed,
			categoriesExpanded,
			toggleExpandCategory,
			canSexMoveBePlayed,
			clampCharacterStat,
			canBePlaced,
			onCharacterDropped,
		} = this.props;

		const {
			sexergyEarned
		} = this.state;

		let characterDropped = null;

		if (nightCharacter !== null) {
			characterDropped = (
				<Character
					clampCharacterStat={clampCharacterStat}
					{...nightCharacter}
				/>
			);
		} else {
			characterDropped = (
				<DroppableCard
					className="o-character -empty"
					task={nightTask}
					onCharacterDropped={onCharacterDropped}
					canBePlaced={canBePlaced}
				>
					<h3 className="o-character__title">Drag character here</h3>
				</DroppableCard>
			);
		}

		const movesSelected = [...sexMovesPlayed];
		if (nightCharacter !== null && sexMovesPlayed.length < 5) {
			movesSelected.push({
				id: -1
			});
		}

		const categories = [
			'Petting',
			'Oral',
			'Sex',
			'Anal',
			'Kinky'
		];
		const movesByCategory = {};
		categories.forEach(category => {
			movesByCategory[category] = sexMoves.filter(sexMove => sexMove.category === category);
		});

		return (
			<article className="o-nightShift">
				<ul className="o-nightShift__log">
					{nightLog.map(entry => {
						return <li>{entry}</li>;
					})}
				</ul>
				<div className="o-nightShift__drop">
					{characterDropped}
				</div>
				<h2 className="o-nightShift__title">Sex Moves</h2>
				<div className="o-nightShift__moves">
					<div className="o-nightShift__moves__scroll">
						{Object.entries(movesByCategory).map((category) => {
							return (
								<SexMoveCategory
									key={`category-${category[0]}`}
									category={category[0]}
									sexMoves={category[1]}
									canSexMoveBePlayed={canSexMoveBePlayed}
									playSexMove={this.playSexMove.bind(this)}
									expanded={categoriesExpanded[category[0]]}
									toggleExpand={toggleExpandCategory}
								/>
							);
						})}
					</div>
				</div>
				<LustBar
					className="o-nightShift__lust"
					lust={lust}
				/>
				<div className="o-nightShift__sexergy">
					<h2 className="o-nightShift__sexergy__title">Sexergy Earned</h2>
					<h2 className="o-nightShift__sexergy__value">{sexergyEarned}</h2>
				</div>
				{this.renderCharacters(this.props)}
			</article>
		);
	}
}