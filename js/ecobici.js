function map_init() {
  var mapOptions = {
    center: new google.maps.LatLng(19.422887,-99.167418),
    zoom: 14
  };
  var map = new google.maps.Map(document.getElementById("theMap"), mapOptions);
  return map;
}

function animate(start, end, map) {
  var steps = 50;
  var markerStart = new google.maps.Marker({position:start, map:map});
  var markerEnd = new google.maps.Marker({position:end, map:map});
  var markerBike = new google.maps.Marker({position:start, map:map});
  var trackLine = new google.maps.Polyline({map: map, path: [start]});
  subanimate(markerBike, start, end, 0, steps, trackLine);
}

function subanimate(marker, start, end, actualstep, totalsteps, line) {
  if (actualstep == totalsteps)
    return;
  // We calculate deltas
  var d_lat = (end.lat() - start.lat()) / totalsteps;
  var d_lng = (end.lng() - start.lng()) / totalsteps;
  // Moving marker to new position
  var markerPosition = marker.getPosition();
  var newPosition = new google.maps.LatLng(markerPosition.lat() + d_lat, markerPosition.lng() + d_lng);
  marker.setPosition(newPosition);
  if (line) {
    line.setPath([start, newPosition]);
  }
  // Schedulling next movement
  setTimeout(function(){subanimate(marker, start, end, actualstep + 1, totalsteps, line)}, 20);
}

$(function(){
  var map = map_init();
  // var start = new google.maps.LatLng(19.41544,-99.164856);
  // var end = new google.maps.LatLng(19.423535,-99.1446);
  // Loading all stations
  $.get('js/estaciones.json', function(data){
    window.estaciones = data;
    var stationicon = {
      fillColor: '#8C2197',
      fillOpacity: 1,
      strokeWeight: 0,
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3,
      zIndex: 10
    }
    $.each(data, function(index, estacion) {
      new google.maps.Marker({position:new google.maps.LatLng(estacion.latitud, estacion.longitud), map:map, icon: stationicon});
    });
  }, 'json');
  $('#btnAnimate').on('click', function (e) {
    animate(start, end, map);
    e.preventDefault();
  });
});