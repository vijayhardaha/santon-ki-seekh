/**
 * Import necessary packages and functions.
 */
import ora from "ora";

import Builder from "./lib/Builder.js";
import BhajanMeta from "./lib/data/bhajansData.js";
import DohaMeta from "./lib/data/dohasData.js";
import QuoteMeta from "./lib/data/quotesData.js";

/**
 * Main function to execute the build processes for Bhajan, Doha, and Quote.
 */
(async function run() {
  const spinner = ora("Starting the build process...").start();

  try {
    // Execute Bhajan build process
    spinner.text = "Executing Bhajan build process...";
    await Builder.run(BhajanMeta);
    spinner.succeed("Bhajan build process executed successfully!");

    // Execute Doha build process
    spinner.text = "Executing Doha build process...";
    await Builder.run(DohaMeta);
    spinner.succeed("Doha build process executed successfully!");

    // Execute Quote build process
    spinner.text = "Executing Quote build process...";
    await Builder.run(QuoteMeta);
    spinner.succeed("Quote build process executed successfully!");

    // Resolve the promise at the end.
    Promise.resolve();
  } catch (error) {
    // Handle any errors that occur during execution
    spinner.fail("An error occurred during the build process.");
    console.error("An error occurred:", error);
  }
}());
