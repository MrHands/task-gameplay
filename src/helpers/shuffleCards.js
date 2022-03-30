export default function shuffleCards(cards) {
	const copy = [];

	for (let n = cards.length; n > 0; n--) {
		let i = Math.floor(Math.random() * n);
		copy.push(cards.splice(i, 1)[0]);
	}

	return copy;
}