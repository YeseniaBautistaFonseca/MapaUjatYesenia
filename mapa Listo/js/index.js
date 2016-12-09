



//Módulo y controlador de la aplicación Angular
app = angular.module('mapsApp', []);
app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);/*Lista blanca de las url seguras permitidas*/
}]);
app.controller('MapCtrl', function($scope,$http) {
    //$scope.filename = '';
    //$scope.getArray = $scope.cities;
   $scope.cities = [
    {
        "city" : 'Ubicación 1',
        "desc" : 'Ubicación de prueba',
        "lat" : 52.238983,
        "long" : -0.888509 
    }
];
  /*Este método permite agregar una nueva dirección al arreglo ciudades. Funciona haciendo un push al arreglo agregando un objeto con diversas propiedades*/ 
  $scope.agregarDireccion = function(){
    $scope.cities.push({
      city: $scope.city,    
      desc: $scope.desc,
      lat: $scope.lat,
      long: $scope.long
    });
     /*Después de hacer el push, las propiedades quedan en blanco para dejar que un nuevo objeto tenga las propiedades limpias*/
    $scope.city = ''
    $scope.desc = ''
    $scope.lat = ''
    $scope.long = ''
    
     /*Después se inicia el mapa de nuevo, mediante el método initialise*/
    $scope.initialise();
    
  }
  /*Este método permite eliminar un índice del arreglo, es decir, eliminar un objeto o ubicación*/
  $scope.removeMarker = function(index){
    $scope.cities.splice(index, 1);
    $scope.initialise();
    
  }

     /*El método initialise contiene las configuraciones del mapa*/
$scope.initialise = function() {
        var myLatlng = new google.maps.LatLng(52.238983, -0.888509);
        var mapOptions = {
            center: myLatlng,
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
       // Geolocalización /
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                animation: google.maps.Animation.DROP,
                title: "Mi ubicación"
            });
        });
        $scope.map = map;
      console.log($scope.map,'this scope map');
       // Marcadores adicionales //
        $scope.markers = [];
        var infoWindow = new google.maps.InfoWindow();
        var createMarker = function (info){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(info.lat, info.long),
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                title: info.city
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.markers.push(marker);
        }  
        for (i = 0; i < $scope.cities.length; i++){
            createMarker($scope.cities[i]);
        }

    };
    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise()); 
    
    /*Método que permite convertir el arreglo a un archivo JSON descargable*/
    $scope.saveJSON = function () {
			$scope.descargar = '';
        /*El archivo tiene un nombre en blanco para llenarlo desde HTML*/
		/*La variable descargar almacena una función de AngularJS llamada toJson que convertirá en un archivo de esa extensión el contenido en el arreglo llamada cities, que contiene las ubicaciones guardadas */	
			$scope.descargar = angular.toJson($scope.cities);
            $scope.nombre;/*Variable que almacena el nombre del archivo dado por el usuario*/
		/*la variable blob almacena el archivo recién convertido a json y lo formatea a un tipo json con caracteres de tipo utf-8*/
			var blob = new Blob([$scope.descargar], { type:"application/json;charset=utf-8;" });			
        /*la variable downloadLink le asigna el enlace de desargar al elemento que está dentro de las etiquetas <a></a>*/
			var downloadLink = angular.element('<a></a>');
                        downloadLink.attr('href',window.URL.createObjectURL(blob));
         /*el archivo de descarga se concatena con la variable nombre para que el archivo adquiera el nombre ingresado por el usuario*/ 
                        downloadLink.attr('download', $scope.nombre+'.json');
			downloadLink[0].click();
		};

  });