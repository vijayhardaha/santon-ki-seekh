/**
 * Fetches all couplets from the API.
 *
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of couplets.
 * @throws {Error} - Throws an error if the request fails or the response is invalid.
 */
export async function fetchCouplets() {
	const response = await fetch("https://kabir-ke-dohe-api.vercel.app/api/couplets?perPage=-1");

	// Check if the response is OK (status code 2xx)
	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();

	// Check if the API response has a success flag
	if (!data.success) {
		throw new Error("API returned an unsuccessful response.");
	}

	const couplets = data.data.couplets;

	// Check if couplets data is valid
	if (!Array.isArray(couplets) || couplets.length === 0) {
		throw new Error("No couplets found in the API response.");
	}

	return data.data.couplets;
}
