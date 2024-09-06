import { SANT_KABIR } from "../helpers/constants.mjs";
import { padIndex } from "../helpers/dataGenerator.mjs";
import { fetchData } from "@/src/api/fetchData.mjs";

/**
 * Fetches Kabir Ke Dohe data from the specified API endpoint.
 * Processes the data to filter out empty dohas and formats it with IDs and content.
 *
 * @return {Promise<Object>} A promise that resolves to an object containing metadata and filtered doha data.
 * @throws {Error} If there's an error fetching or processing the data.
 */
async function fetchDoheData() {
	try {
		const couplets = await fetchData();

		// Process and filter data
		const data = couplets
			.filter((item) => item.couplet_hindi && item.couplet_hindi.trim() !== "") // Filter out empty dohas
			.map((item) => ({
				id: `${item.slug}-${padIndex(item.index)}`, // Generate a unique ID using slug and index
				author: SANT_KABIR, // Author of the dohas
				content: item.couplet_hindi.split("\n").map((couplet) => couplet.trim()), // Split and trim dohas
			}));

		const metaData = {
			fileName: "santon-ke-dohe",
			mdTitle: "संतों के दोहे (Couplets)",
			data,
			appendNumber: true,
		};

		return metaData;
	} catch (error) {
		console.error("Error fetching data:", error);
		throw error; // Rethrow the error to be handled by the caller
	}
}

export default fetchDoheData;
