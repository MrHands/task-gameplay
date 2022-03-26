import React from 'react';

import Character from '../components/Character';
import CharacterList from '../components/CharacterList';
import DroppableCard from '../components/DroppableCard';
import LustBar from '../components/LustBar';
import SexMove from '../components/SexMove';

import './NightShift.scss';

export default class NightShift extends React.Component {
	constructor() {
		super();

		this.state = {
			sexergyEarned: 0
		}
	}

	playSexMove(sexMoveId) {
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

		this.props.playSexMove(sexMoveId);
	}

	renderCharacters(props) {
		const {
			nightCharacter,
			charactersUnplaced,
			clampCharacterStat,
			canBePlaced,
		} = props;

		if (nightCharacter !== null) {
			return <div className="o-nightShift__characters" />;
		}

		return (
			<CharacterList
				className="o-nightShift__characters"
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
			nightTask,
			nightCharacter,
			lust,
			sexMoves,
			sexMovesPlayed,
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

		return (
			<article className="o-nightShift">
				<div className="o-nightShift__drop">
					{characterDropped}
				</div>
				<div className="o-nightShift__moves">
					{sexMoves.map((sexMove, index) => {
						return (
							<SexMove
								key={`sex-move-${index}`}
								canSexMoveBePlayed={canSexMoveBePlayed}
								playSexMove={this.playSexMove.bind(this)}
								{...sexMove}
							/>
						);
					})}
				</div>
				<div className="o-nightShift__lust">
					<h2 className="o-nightShift__lust__title">Lust</h2>
					<LustBar
						className="o-nightShift__lust__bar"
						value={lust}
						max="100"
					/>
					<h2 className="o-nightShift__lust__amount">{`${lust}%`}</h2>
				</div>
				<div className="o-nightShift__sexergy">
					<h2 className="o-nightShift__sexergy__title">Sexergy Earned</h2>
					<h2 className="o-nightShift__sexergy__value">{sexergyEarned}</h2>
				</div>
				<div className="o-nightShift__scrolling">
					{this.renderCharacters(this.props)}
					{this.renderSelected(this.props, movesSelected)}
				</div>
			</article>
		);
	}
}