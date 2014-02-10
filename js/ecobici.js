function map_init() {
  var mapOptions = {
    center: new google.maps.LatLng(19.422887,-99.167418),
    zoom: 13
  };
  var map = new google.maps.Map(document.getElementById("theMap"), mapOptions);
  return map;
}

function animate(start, end, map) {
  var markerStart = new google.maps.Marker({position:start, map:map});
  var markerEnd = new google.maps.Marker({position:end, map:map});
}

$(function(){
  var map = map_init();
  var start = new google.maps.LatLng(19.41544,-99.164856);
  var end = new google.maps.LatLng(19.423535,-99.1446);
  animate(start, end, map);
});