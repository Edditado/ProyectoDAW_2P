var start, end;
var waypts = [], trip=[];
var directionsDisplay=new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();

function MAP_initialize(){
    
    var latIni = "-2.172637";
    var longIni = "-79.940418";


    MAP_crearMapa(latIni, longIni, "divSolic", "solicitar");
    MAP_crearMapa(latIni, longIni, "nRuta", "newRuta");
}

function MAP_crearMapa(lat, long, divHtml, tipoRuta){
    var myCenter = new google.maps.LatLng( parseFloat(lat), parseFloat(long) );

    

    var mapProp = {
        center:myCenter,
        zoom:17,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById(divHtml), mapProp);
    
    var imagePerson = {
        url: "../static/img/personMarker.png",
        //size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 50)
    };

    var imageCar = {
        url: "../static/img/carMarker.png",
        //size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(70, 70)
    };

	if(tipoRuta == "newRuta"){
        
        var marker=new google.maps.Marker({
            position:myCenter,
            icon: imageCar,
            draggable:true,
            title:"Arrastrame!",
            animation:google.maps.Animation.DROP
        });
        //ubicarMarcadorSolicitantes(parseFloat(lat), parseFloat(long), map, imagePerson);
        
        directionsDisplay.setMap(map);
       
        google.maps.event.addListener(marker,'dragstart',dibujarRuta);  
        google.maps.event.addListener(marker,'dragend',dibujarRuta);
      
        function dibujarRuta(event) {
        		
                if (start == null) {
                    start = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
                    
                    return;
                }

                else if (end == null) {
                    end = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()); 
                }
                else {
                    waypts.push({
                        location: end,
                        stopover: false
                    });
                    end = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
                  
                }
                
                var request = {
                    origin: start,
                    destination: end,
                    waypoints: waypts,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING

                };

                directionsService.route(request, function (response, status) {
                    
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    }
                });
                //waypts = [];
        } 
        
       
    }
    else if(tipoRuta == "solicitar"){
        var marker=new google.maps.Marker({
            position:myCenter,
            icon: imagePerson,
            animation:google.maps.Animation.BOUNCE
    	});
    	
	}	
	marker.setMap(map);
    
    var infowindow = new google.maps.InfoWindow({
       	content:"Estas Aquí"
    });
    
    google.maps.event.addListener(marker, 'click', function() {
       	infowindow.open(map,marker);
    });

    $('a[href^="#nRu"]').on('shown.bs.tab', function () {
        
        /* Trigger map resize event */
        google.maps.event.trigger(map, 'resize');
        map.setCenter(myCenter);
    });

    $('a[href^="#' + divHtml + '"]').on('shown.bs.tab', function () {
       
       	/* Trigger map resize event */
       	google.maps.event.trigger(map, 'resize');
     	map.setCenter(myCenter);
    });
}	    
window.addEventListener('load', MAP_initialize);    