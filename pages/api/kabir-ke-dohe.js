import { fetchData } from "@/src/api/fetchData.mjs";

/**
 * API route handler for submitting contact form data to Google Sheets.
 *
 * @param {import('next').NextApiRequest} req - The HTTP request object.
 * @param {import('next').NextApiResponse} res - The HTTP response object.
 */
export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ success: false, message: "Method not allowed. Use POST." });
	}

	try {
		const data = await fetchData();

		// Send successful response.
		return res.status(200).json({ success: true, data: data });
	} catch (error) {
		// Log error for debugging.
		console.error("Error fetching volunteer data:", error);

		// Provide a specific error message.
		let errorMessage = error.message || "An unexpected error occurred";

		// Send error response.
		return res.status(500).json({ success: false, message: errorMessage });
	}
}
