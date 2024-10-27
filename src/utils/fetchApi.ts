export const fetchApi = async (url: string) => {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching api:", error);
    return null;
  }
};
