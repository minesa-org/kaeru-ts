export function formatMultiline(input: string): string {
	return input
		.split("\n")
		.flatMap(function (line: string) {
			const headingMatch = line.match(/^(#+)\s+(.*)$/);
			if (headingMatch) {
				const hashes = headingMatch[1];
				const content = headingMatch[2];
				const parts = content
					.split(/\s{2,}/)
					.map((str: string) => str.trim())
					.filter(Boolean);
				return [hashes + " " + parts[0]].concat(parts.slice(1));
			}

			return line
				.split(/\s{2,}/)
				.map((str: string) => str.trim())
				.filter(Boolean);
		})
		.join("\n");
}
