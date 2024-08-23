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
		const verses = await fetchData();

		// Process and filter data
		const data = verses
			.filter( ( item ) => item.verse_hi && item.verse_hi.trim() !== "" ) // Filter out empty dohas
			.map( ( item ) => ( {
				id: `${ item.slug }-${ padIndex( item.index ) }`, // Generate a unique ID using slug and index
				author: SANT_KABIR, // Author of the dohas
				content: item.verse_hi.split( "\n" ).map( ( verse ) => verse.trim() ), // Split and trim dohas
			} ) );

		const metaData = {
			fileName: "santon-ke-dohe",
			mdTitle: "संतों के दोहे (Couplets)",
			data,
			appendNumber: true,
		};

		return metaData;
	} catch ( error ) {
		console.error( "Error fetching data:", error );
		throw error; // Rethrow the error to be handled by the caller
	}
}

export default fetchDoheData;
