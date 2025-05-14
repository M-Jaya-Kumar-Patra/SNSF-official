// // components/MapView.js
// const MapView = () => {
//   return (
//     <div style={{ width: '100%', height: '300px' }}>
//       <iframe
//         width="100%"
//         height="100%"
//         frameBorder="0"
//         style={{ border: 0 }}
//         src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB_CR0Npoxqk8EcuhswG0i8RJihXeXxoJQ&callback=initMap&v=weekly&solution_channel=GMP_CCS_customcontrols_v2"
//         allowFullScreen
//       ></iframe>
//     </div>
//   );
// };

// export default MapView;



// components/MapView.js
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 19.495160513503688,  // Eiffel Tower latitude
  lng: 84.73012009286559,   // Eiffel Tower longitude
};

const MapView = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        {/* You can add markers or other components here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
