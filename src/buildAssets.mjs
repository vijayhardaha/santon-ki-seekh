/**
 * Import necessary packages and functions.
 */
import ora from "ora";

import Builder from "./lib/Builder.mjs";
import BhajanMeta from "./lib/data/bhajansData.mjs";
import fetchDoheData from "./lib/data/dohasData.mjs";
import QuoteMeta from "./lib/data/quotesData.mjs";

/**
 * Main function to execute the build processes for Bhajan, Doha, and Quote.
 */
( async function run() {
	const spinner = ora( "Starting the build process..." ).start();

	try {
		// Execute Bhajan build process
		spinner.start( "Executing Bhajans build process..." ); // Start a new spinner
		await Builder.run( BhajanMeta );
		spinner.succeed( "Bhajans build process executed successfully!" );

		// Execute Doha build process
		spinner.start( "Executing Dohe build process..." ); // Start a new spinner
		const DoheMeta = await fetchDoheData();
		await Builder.run( DoheMeta );
		spinner.succeed( "Dohe build process executed successfully!" );

		// Execute Quote build process
		spinner.start( "Executing Quotes build process..." ); // Start another new spinner
		await Builder.run( QuoteMeta );
		spinner.succeed( "Quotes build process executed successfully!" );

		// Resolve the promise at the end.
		Promise.resolve();
	} catch ( error ) {
		// Handle any errors that occur during execution
		spinner.fail( "An error occurred during the build process." );
		console.error( "An error occurred:", error );
	}
}() );
