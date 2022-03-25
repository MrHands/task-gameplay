import React from 'react';

import './LustBar.scss';

export default class LustBar extends React.Component {
	render() {
		const {
			value,
			max,
		} = this.props;

		const style = {
			width: `${(value / max) * 100}%`
		}

		return (
			<div className={['m-lustBar', this.props.className].join(' ')}>
				<div className="m-lustBar__foreground" style={style}></div>
			</div>
		);
	}
}