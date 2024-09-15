import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from "@react-google-maps/api";

const useGoogleMaps = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAyy8CB38wO_EDwAG8bO_WuKrO46JrvKt0", // Replace with your API key
    libraries: ['places', 'directions'], 
  });

  return { isLoaded, loadError };
};

export default useGoogleMaps;