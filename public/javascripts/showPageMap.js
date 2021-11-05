 //using my own mapbox token
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
}); 

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates) //pass the same point as it is on above code
.addTo(map);
