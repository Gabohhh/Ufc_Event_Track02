// src/api/ufcApi.js

// The URL for the real, external ESPN API for the UFC scoreboard.
const API_URL = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard";

// This function maps the status from the ESPN API to a more user-friendly format.
const getEventStatus = (statusType) => {
  switch (statusType) {
    case "STATUS_SCHEDULED":
      return "Upcoming";
    case "STATUS_IN_PROGRESS":
      return "Happening Now";
    case "STATUS_FINAL":
      return "Finished";
    default:
      return "Scheduled";
  }
};

// This is the main function that fetches and processes the data.
// It connects to an external API as required by the assignment.
export const fetchEvents = async () => {
  console.log("Fetching events from ESPN API...");
  try {
    // Use the Fetch API to make a network request to the external URL.
    const response = await fetch(API_URL);

    // This handles errors in case the API response is not successful (e.g., 404 Not Found).
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // The API data is nested inside `data.events`. We check if it exists.
    if (!data.events) {
      return []; // Return an empty array if there are no events.
    }

    // Process the raw API data into the simplified format our app uses.
    // This makes the rest of our application independent of the complex API structure.
    const processedEvents = data.events.map((event) => {
      return {
        id: event.id, // The unique ID for the event.
        name: event.name, // The full name of the event, e.g., "UFC 305".
        date: event.date.split("T")[0], // Keep only the date part (YYYY-MM-DD).
        status: getEventStatus(event.status.type.name), // Get our custom status string.
      };
    });

    return processedEvents;

  } catch (error) {
    // This catches network errors or errors from a failed request.
    console.error("Failed to fetch events from ESPN API:", error);
    // Re-throw the error so the calling component (App.js) knows the request failed.
    throw error;
  }
};