
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
  {var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
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
    "Light Map": lightmap,
    "Dark Map": darkmap
  };
  
  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap]
  });

  
  // Create a layer control containing our baseMaps
  var overlayMaps={
    Earthquakes:earthquakes
  }
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps,overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  console.log(Object.keys(earthquakes._layers).length)
  function getColor(d) {
    return d > 5  ? '#E31A1C' :
           d > 4  ? '#FC4E2A' :
           d > 3   ? '#FD8D3C' :
           d > 2   ? '#FEB24C' :
           d > 1   ? '#FED976' :
                      '#FFEDA0';
}
 for(var i = 1; i<Object.keys(earthquakes._layers).length;i++){
     //console.log(i) 
      //try to see if a value is stored in earthquake for current iteriation of loop, otherwise move to next item in object
      try
        { var lat = earthquakes._layers[i]._latlng.lat;
          var lng = earthquakes._layers[i]._latlng.lng;
          var mag = earthquakes._layers[i].feature.properties.mag;
          //console.log(lng)
          //console.log(lat)
          //console.log(mag)
          var color=getColor(mag);
/*         if(mag<=1){
            color="lightgreen";
        }
        else if(mag<=2){
            color="yellow";
        }
        else if(mag<=3){
            color="orange"
        }
        else if(mag<=4){
            color="coral"
        }
        else{
            color="red";
        } */
            L.circle([lat, lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.75,
                radius: mag*50000}).bindPopup("<h3>" + earthquakes._layers[i].feature.properties.place +
                "</h3><hr><p>" + new Date(earthquakes._layers[i].feature.properties.time) + "</p>").addTo(myMap);}
      catch(e){
        //catches if an error occurs and moves to next item in Object
          i++;
}
  };
  var legend = L.control({position: 'bottomright'});



  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);


};