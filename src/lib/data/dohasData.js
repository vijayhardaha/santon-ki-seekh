import axios from "axios";
import {SANT_KABIR} from "../helpers/constants.js";

// URL to fetch Kabir Ke Dohe API data
const apiUrl = "https://santo-ki-seekh.netlify.app/api/kabir-ke-dohe/";

/**
 * Fetches Kabir Ke Dohe data from the specified API endpoint.
 * @return {Promise<Object>} A promise that resolves to an object containing metadata and filtered dohe data.
 * @throws {Error} If there's an error fetching or processing the data.
 */
async function fetchDoheData() {
  try {
    // Fetch data from API endpoint
    const response = await axios.get(apiUrl);
    const doheData = response.data;

    // Process or filter data as needed
    const filteredData = doheData
      .filter((item) => item.doha && item.doha.trim() !== "") // Filter out empty doha
      .map((item) => ({
        id: item.slug, // Assuming item has a slug property for ID
        content: item.doha.split("\n").map((doha) => doha.trim()),
        author: SANT_KABIR, // Replace with actual author data if available
        meaning: item.meaning, // Assuming item has a meaning property
      }));

    const DohaMeta = {
      fileName: "santon-ke-dohe",
      mdTitle: "संतों के दोहे (Couplets)",
      data: filteredData, // Using filteredData instead of dataSet
    };

    return DohaMeta;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Optionally rethrow or handle the error as needed
  }
}

export default fetchDoheData;
