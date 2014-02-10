function map_init() {
  var mapOptions = {
    center: new google.maps.LatLng(19.422887,-99.167418),
    zoom: 13
  };
  var map = new google.maps.Map(document.getElementById("theMap"), mapOptions);
  return map;
}

function animate(start, end, map) {
  var steps = 50;
  var markerStart = new google.maps.Marker({position:start, map:map});
  var markerEnd = new google.maps.Marker({position:end, map:map});
  var markerBike = new google.maps.Marker({position:start, map:map});
  subanimate(markerBike, start, end, 0, steps)
}

function subanimate(marker, start, end, actualstep, totalsteps) {
  if (actualstep == totalsteps)
    return;
  // We calculate deltas
  var d_lat = (end.lat() - start.lat()) / totalsteps;
  var d_lng = (end.lng() - start.lng()) / totalsteps;
  // Moving marker to new position
  var markerPosition = marker.getPosition();
  var newPosition = new google.maps.LatLng(markerPosition.lat() + d_lat, markerPosition.lng() + d_lng);
  marker.setPosition(newPosition);
  // Schedulling next movement
  setTimeout(function(){subanimate(marker, start, end, actualstep + 1, totalsteps)}, 20);
}

$(function(){
  var map = map_init();
  var start = new google.maps.LatLng(19.41544,-99.164856);
  var end = new google.maps.LatLng(19.423535,-99.1446);
  animate(start, end, map);
});