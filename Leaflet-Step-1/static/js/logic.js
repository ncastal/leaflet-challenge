
// Store our API endpoint as queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
"2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

d3.json(queryUrl, function(data){
    //console.log(data);

    createFeatures(data.features);
});

function createFeatures(earthquakeData){

    function onEachFeature(feature, layer){

        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    var earthquakes =L.geoJson(earthquakeData, {
      onEachFeature:onEachFeature
    });
    console.log(earthquakes._layers)

    createMap(earthquakes)
}
  
  // Define streetmap and darkmap layers
  function createMap(earthquakes)
  {var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  
  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap]
  });

  
  // Create a layer control containing our baseMaps
  var overlayMaps={
    Earthquakes:earthquakes
  }
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps,overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Create a circle and pass in some initial options
/* L.circle([45.52, -122.69], {
    color: "green",
    fillColor: "green",
    fillOpacity: 0.75,
    radius: 10000
  }).addTo(myMap); */
  console.log(Object.keys(earthquakes._layers).length)
 for(var i = 1; i<Object.keys(earthquakes._layers).length;i++){
     console.log(i) 
try
{  var lat = earthquakes._layers[i]._latlng.lat;
  var lng = earthquakes._layers[i]._latlng.lng;
  var mag = earthquakes._layers[i].feature.properties.mag;
  console.log(lng)
  console.log(lat)
  console.log(mag)
  var color;
if(mag<=1){
    color="lightgreen";
}
else if(mag<=2){
    color="yellow";
}
else if(mag<=3){
    color="orange"
}
else if(mag<=4){
    color="red"
}
else{
    color="red";
}
    L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.75,
        radius: mag*50000}).addTo(myMap);}
catch(e){
    i++;
}
  }}