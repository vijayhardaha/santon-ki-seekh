import { getGoogleSheetData } from "./getGoogleSheetData.mjs";
import {
	cleanString,
	createSlug,
	generateShortHash,
	padIndex,
	parseAndUniqueList,
} from "./utils.mjs";

/**
 * Fetches data from the API, processes it, and saves it to JSON files.
 * @return {Promise<void>} - A promise that resolves when the data has been fetched and saved.
 */
export const fetchData = async () => {
	// Fetch data from Google Sheets.
	const verses = await getGoogleSheetData("kabir-ke-dohe");

	// Validate the data.
	if (!Array.isArray(verses)) {
		throw new Error("Invalid data format received from Google Sheets.");
	}

	let processedData = verses.map((row) => ({
		index: parseInt(row.index ?? 0),
		slug: cleanString(createSlug(row.title_english, "-")),
		featured: row.featured?.toLowerCase() === "yes" || false,
		verse_hindi: cleanString(row.verse_hindi ?? ""),
		translation_hindi: row?.translation_hindi?.trim() ?? "",
		explanation_hindi: row?.explanation_hindi?.trim() ?? "",
		verse_english: cleanString(row.verse_english ?? ""),
		translation_english: row?.translation_english?.trim() ?? "",
		explanation_english: row?.explanation_english?.trim() ?? "",
		categories: row?.categories?.trim() ?? "",
		tags: row?.tags?.trim() ?? "",
	}));

	// Track used hashes to detect collisions
	const usedHashes = new Set();

	// Process the data to add the padded index and short hash to the slug
	processedData = processedData.map((item, index) => {
		const indexPadded = padIndex(index);
		const originalText = `${item.slug}-${indexPadded}`;
		const cleanSlug = createSlug(originalText);
		let shortHash = generateShortHash(cleanSlug);

		// Check for collisions and regenerate hash if needed
		while (usedHashes.has(shortHash)) {
			shortHash = generateShortHash(`${cleanSlug}${Math.random()}`);
		}
		usedHashes.add(shortHash);

		// Process tags with slugified keys
		const categories = parseAndUniqueList(item.categories);
		const tags = parseAndUniqueList(item.tags);

		return {
			id: index + 1,
			slug: createSlug(item.slug),
			unique_slug: createSlug(`${cleanSlug}-${shortHash}`),
			verse_hindi: item.verse_hindi,
			verse_english: item.verse_english,
			translation_hindi: item.translation_hindi,
			translation_english: item.translation_english,
			explanation_hindi: item.explanation_hindi,
			explanation_english: item.explanation_english,
			featured: Boolean(item.featured) || false,
			categories: categories.map((cat) => ({
				slug: createSlug(cat),
				name: cat,
			})),
			tags: tags.map((tag) => ({
				slug: createSlug(tag),
				name: tag,
			})),
		};
	});

	return processedData;
};
