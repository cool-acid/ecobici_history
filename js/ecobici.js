function map_init() {
  var mapOptions = {
    center: new google.maps.LatLng(19.422887,-99.167418),
    zoom: 13
  };
  var map = new google.maps.Map(document.getElementById("theMap"), mapOptions);
}
$(function(){
  map_init();
});