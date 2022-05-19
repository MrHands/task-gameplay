import React from 'react';

import Location from './Location';

import './LocationList.scss';

export default class LocationList extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-locationList'];

		classes.push(className);

		return classes;
	}

	render() {
		const {
			locations,
			clampCharacterStat,
		} = this.props;

		return (
			<div className={this.classes.join(' ')}>
				{ locations.map((location, index) => {
					return <Location
						key={`task-${index}`}
						location={location}
						clampCharacterStat={clampCharacterStat}
					/>;
				})}
			</div>
		);
	}
}