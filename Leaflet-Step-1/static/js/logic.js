// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
  
// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

  var mag = [];

for (var i = 0; i < data.features.length; i++) {
  
  var quake = data.features[i];

  var location = [quake.geometry.coordinates[1], quake.geometry.coordinates[0]];

  mag.push(quake.properties.mag);

  L.circle(location, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "red",
    radius: quake.properties.mag*25000})
    .bindPopup("<h1>" + quake.properties.place + "</h1> <hr> <h3>Magnitude " + quake.properties.mag  + "</h3>")
    .addTo(myMap);
  };

  var maxMag = mag.reduce(function(a, b) {
    return Math.max(a, b);
});
    // Create an overlays object to add to the layer control
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = [
      "<h3><strong>Info Legend<strong></h3>",
      "<hr>",
      "<p>Number of quakes in the last week: " + data.features.length + "</p>",
      "<p>Maximum intensity of: " + maxMag + "</p>"];
    return div;
    };

    legend.addTo(myMap);
  
});

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, 24.71
  ],
  zoom: 3,
  layers: [streetmap]
});
