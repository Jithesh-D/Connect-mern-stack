const addEventToServer = async (formData) => {
  try {
    console.log("Sending event data to server");
    // Log the FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await fetch("http://localhost:3001/api/events", {
      method: "POST",
      credentials: "include",
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
    const response = await fetch("http://localhost:3001/api/events");

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

export { addEventToServer, getEventsFromServer };
