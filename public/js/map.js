mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: [77.2088, 28.613], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9 // starting zoom
});

// generally , if we write this code in ejs file it will be executed.
// the public javascript files doesnot have access to the environmental variables
// so by writing a script file in the show.ejs file and connecting to the map.js file.

console.log(coordinates);

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(coordinates)
.addTo(map); 