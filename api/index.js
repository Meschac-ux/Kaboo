import axios from "axios";

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

export const getPlace = async (placeQuery) => {
  const options = {
    method: "GET",
    url: "https://google-map-places.p.rapidapi.com/maps/api/place/textsearch/json",
    params: {
      query: placeQuery,
      language: "fr",
    },
    headers: {
      "x-rapidapi-key": "0364b63912msh40c61f0ab5875e4p1008f6jsn257e8101305a",
      "x-rapidapi-host": "google-map-places.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching the place:", error);
    throw error;
  }
};

export const getPlaceV2 = async (placeQuery) => {
  const options = {
    method: "GET",
    url: "https://google-map-places.p.rapidapi.com/maps/api/place/textsearch/json",
    params: {
      query: placeQuery,
      radius: "1000",
      language: "fr",
      region: "fr",
    },
    headers: {
      "x-rapidapi-key": "be9d2221f6msha87014b7500a926p182c7fjsn619807831ef5",
      "x-rapidapi-host": "google-map-places.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);

    return response.data
  } catch (error) {
    console.error(error);
  }
};

export const getPlacePhoto = async (photoRef) => {
  const options = {
    method: "GET",
    url: "https://google-map-places.p.rapidapi.com/maps/api/place/photo",
    params: {
      photo_reference:
        "ATJ83zhSSAtkh5LTozXMhBghqubeOxnZWUV2m7Hv2tQaIzKQJgvZk9yCaEjBW0r0Zx1oJ9RF1G7oeM34sQQMOv8s2zA0sgGBiyBgvdyMxeVByRgHUXmv-rkJ2wyvNv17jyTSySm_-_6R2B0v4eKX257HOxvXlx_TSwp2NrICKrZM2d5d2P4q",
    },
    headers: {
      "x-rapidapi-key": "0364b63912msh40c61f0ab5875e4p1008f6jsn257e8101305a",
      "x-rapidapi-host": "google-map-places.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const getNearbyPlace = async ({placeQuery, location, type}) => {
  const options = {
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    params: {
      keyword: placeQuery, 
      location: location,
      radius: 1500,
      type: type,
      key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching place data:", error);
    return null;
  }
};
