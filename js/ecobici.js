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
  var stationicon = {
    fillColor: '#8C2197',
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#8C2197',
    path: google.maps.SymbolPath.CIRCLE,
    scale: 3,
    zIndex: 10
  };
  var bikeicon = {
    fillColor: '#FF0000',
    fillOpacity: 1,
    strokeWeight: 0,
    path: google.maps.SymbolPath.CIRCLE,
    scale: 5,
    zIndex: 10
  };
  var markerStart = new google.maps.Marker({position:start, map:map, icon:stationicon});
  var markerEnd = new google.maps.Marker({position:end, map:map, icon:stationicon});
  var markerBike = new google.maps.Marker({position:start, map:map, icon:bikeicon});
  var trackLine = new google.maps.Polyline({map: map, path: [start], strokeColor:'#000000', strokeOpacity: 0.4});
  subanimate(markerBike, start, end, 0, steps, trackLine);
}

function subanimate(marker, start, end, actualstep, totalsteps, line) {
  if (actualstep == totalsteps){
    $(window).trigger('finish');
    actualtrip = actualtrip + 1;
    marker.setMap(null);
    return;
  }
  // We calculate deltas
  var d_lat = (end.lat() - start.lat()) / totalsteps;
  var d_lng = (end.lng() - start.lng()) / totalsteps;
  // Moving marker to new position
  var markerPosition = marker.getPosition();
  var newPosition = new google.maps.LatLng(markerPosition.lat() + d_lat, markerPosition.lng() + d_lng);
  marker.setPosition(newPosition);
  window.estacionesvisitadas.push(newPosition);
  if (line) {
    line.setPath([start, newPosition]);
  }
  // Schedulling next movement
  setTimeout(function(){subanimate(marker, start, end, actualstep + 1, totalsteps, line)}, 20);
}

$(function(){
  window.map = map_init();
  window.actualtrip = 0;
  window.estacionesvisitadas = [];
  // Loading all stations
  $.get('js/estaciones.json', function(data){
    window.estaciones = data;
    var stationicon = {
      fillColor: '#FFFFFF',
      fillOpacity: 0,
      strokeWeight: 2,
      strokeColor: '#8C2197',
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3,
      zIndex: 10
    }
    $.each(data, function(index, estacion) {
      new google.maps.Marker({position:new google.maps.LatLng(estacion.latitud, estacion.longitud), map:map, icon: stationicon});
    });
  }, 'json');
  $('#btnAnimate').on('click', function(e){
    e.preventDefault();
    var cardID = $('#cardID').val();
    if (!cardID) {
      alert('Si no me dices el numero de tarjeta no puedo calcular tus rutas. No soy adivino.');
      return;
    }
    $.get("http://www.corsproxy.com/datos.labplc.mx/movilidad/ecobici/usuario/" + cardID + ".json", function (data) {
      if (!data) {
        alert('No se han encontrado registros. Revisa el número de tu tarjeta.');
        return;
      }
      window.viajes = data.ecobici.viajes;
      var start = new google.maps.LatLng(estaciones[viajes[0].station_removed].latitud, estaciones[viajes[0].station_removed].longitud);
      var end = new google.maps.LatLng(estaciones[viajes[0].station_arrived].latitud, estaciones[viajes[0].station_arrived].longitud);
      animate(start, end, map);
    }, 'json').fail(function(){
      alert('Ups! Parece que el API no esta respondiendo. Intentalo nuevamente en unos segundos.');
    });
  });
  $(window).on('finish', function(){
    if (actualtrip == viajes.length){
      // heatmap = new google.maps.visualization.HeatmapLayer({
      //   data: estacionesvisitadas,
      //   map: map,
      //   radius: 20
      // });
      return;
    } // No more trips
    if (viajes[actualtrip].station_removed != viajes[actualtrip].station_arrived){
      var start = new google.maps.LatLng(estaciones[viajes[actualtrip].station_removed].latitud, estaciones[viajes[actualtrip].station_removed].longitud);
      var end = new google.maps.LatLng(estaciones[viajes[actualtrip].station_arrived].latitud, estaciones[viajes[actualtrip].station_arrived].longitud);
      animate(start, end, map);
    }else{
      window.actualtrip++;
      $(window).trigger('finish');
    }
  });
});