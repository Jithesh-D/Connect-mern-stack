const addEventToServer = async (formData) => {
  try {
    console.log("Sending event data to server");
    // Log the FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const token = localStorage.getItem("eventToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
      method: "POST",
      credentials: "include",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const event = await response.json();
    return event;
  } catch (error) {
    console.error("Error in addEventToServer:", error);
    throw error;
  }
};

const getEventsFromServer = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const events = await response.json();
    return events;
  } catch (error) {
    console.error("Error in getEventsFromServer:", error);
    throw error;
  }
};

const deleteEventFromServer = async (eventId) => {
  try {
    const token = localStorage.getItem("eventToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/events/${eventId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in deleteEventFromServer:", error);
    throw error;
  }
};

export { addEventToServer, getEventsFromServer, deleteEventFromServer };
