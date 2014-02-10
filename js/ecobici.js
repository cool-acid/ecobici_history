function map_init() {
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8
  };
  var map = new google.maps.Map(document.getElementById("theMap"), mapOptions);
}
$(function(){
  map_init();
});