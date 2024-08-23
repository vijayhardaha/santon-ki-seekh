import { JWT } from "google-auth-library";

/**
 * Creates and returns a JWT client for Google APIs.
 *
 * @returns {JWT} An instance of JWT configured with the service account credentials.
 */
export function createJwtClient() {
	// Decode the base64 encoded JSON string
	const base64ServiceAccount = process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_BASE64;

	if (!base64ServiceAccount) {
		throw new Error("Base64 encoded service account is not defined in environment variables.");
	}

	// Decode and parse the JSON
	const decodedJson = Buffer.from(base64ServiceAccount, "base64").toString("utf8");
	const serviceAccount = JSON.parse(decodedJson);

	const { client_email, private_key } = serviceAccount;

	if (!client_email || !private_key) {
		throw new Error("Service account email or private key is missing.");
	}

	return new JWT({
		email: client_email,
		key: private_key,
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
}
