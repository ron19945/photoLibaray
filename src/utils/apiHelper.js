export const sendPhotosToAPI = async (endpoint, photos) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photos }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload photos: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error sending photos to API:", error);
      throw error;
    }
  };
  