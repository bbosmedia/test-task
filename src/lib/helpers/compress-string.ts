// Compress String
export const compressString = (input: string): string => {
	const grouped: string[] = [];
	let count = 1;

	for (let i = 1; i <= input.length; i++) {
		if (input[i] === input[i - 1]) {
			count++;
		} else {
			grouped.push(count > 1 ? `${count}${input[i - 1]}` : input[i - 1]);
			count = 1;
		}
	}


	let compressed = grouped.join('');

	
	const repeatingPattern = /((\d+[А-Я])+)\1/g;
	compressed = compressed.replace(repeatingPattern, (match, p1) => {
		const repeatCount = match.length / p1.length;
		return `${repeatCount}(${p1})`;
	});

	return compressed;
};
