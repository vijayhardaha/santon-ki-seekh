const express = require( "express" );
const serverless = require( "serverless-http" );

const { fetchKabirKeDohe } = require( "../../src/fetchKabirKeDohe" );

// Create an Express router instance
const router = express.Router();

// Define Express application
const app = express();

// Middleware to parse JSON bodies
app.use( express.json() );

/**
 * Endpoint to fetch Kabir Ke Dohe.
 * @route GET /.netlify/functions/api/kabir-ke-dohe
 * @return {Object[]} 200 - Array of Kabir Ke Dohe objects
 * @return {Error} 500 - Internal server error
 */
router.get( "/kabir-ke-dohe", async ( req, res ) => {
	try {
		const data = await fetchKabirKeDohe();
		res.json( data );
	} catch ( error ) {
		res.status( 500 ).json( { error: error.message } );
	}
} );

// Catch-all for non-existing endpoints
router.use( ( req, res ) => {
	res.status( 404 ).json( { error: "Endpoint not found" } );
} );

// Use the router for all /api routes
app.use( "/api", router );

// Export the Express app wrapped in serverless-http
module.exports.handler = serverless( app );
