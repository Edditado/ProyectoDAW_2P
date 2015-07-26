 var start, end;
 var waypts = [], trip=[];
 var directionsDisplay=new google.maps.DirectionsRenderer();
 var directionsService = new google.maps.DirectionsService();


 function MAP_initialize(){
    var usrStorage = sessionStorage.getItem('tc');
    var latIni = "-2.172637";
    var longIni = "-79.940418";

    MAP_crearMapa(latIni, longIni, "divSolic", "solicitar");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","xml/cuentas.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    var xmlUsrs = xmlDoc.getElementsByTagName("user");
    var xmlUsr, xmlCta;

    for (var i = 0; i < xmlUsrs.length; i++) {
        xmlUsr = xmlUsrs[i].firstChild.nodeValue;
     
        if (usrStorage == xmlUsr) {
            xmlCta = xmlUsrs[i].parentElement;
            var rutas = xmlCta.getElementsByTagName("ruta");
            var ptoInicio, lat, long;

            for (var j = 0; j < rutas.length; j++) { 
                ptoInicio = rutas[j].getElementsByTagName("inicio")[0]; 
                lat_i = ptoInicio.getElementsByTagName("lat")[0].firstChild.nodeValue;
                long_i = ptoInicio.getElementsByTagName("long")[0].firstChild.nodeValue;

                ptoFin = rutas[j].getElementsByTagName("fin")[0];
                lat_f = ptoFin.getElementsByTagName("lat")[0].firstChild.nodeValue;
                long_f = ptoFin.getElementsByTagName("long")[0].firstChild.nodeValue;

                camino = rutas[j].getElementsByTagName("camino")[0];
                ptosCamino = camino.getElementsByTagName("pto");
                var inicio = new google.maps.LatLng(parseFloat(lat_i), parseFloat(long_i));
                var fin = new google.maps.LatLng(parseFloat(lat_f), parseFloat(long_f));

                trip.push(inicio);
                for(var k = 0; k < ptosCamino.length; k++){
                    
                    lat = ptosCamino[k].getElementsByTagName("lat")[0].firstChild.nodeValue;
                    long = ptosCamino[k].getElementsByTagName("long")[0].firstChild.nodeValue;

                    
                    var LatLng = new google.maps.LatLng( parseFloat(lat), parseFloat(long) );
                   
                    trip.push(LatLng);
                    
                }
                trip.push(fin);
                MAP_crearMapa(lat_i, long_i, ("ruta"+(j+1)), "savedRuta");
            }
            
            MAP_crearMapa(latIni, longIni, "nRuta", "newRuta");
            
        }
    }
    /*validación botón Guardar Ruta*/
    bGuardarRuta.addEventListener('click', function () {

        if (($(fechaRuta).val() == "" || $(horaRuta).val() == "") && end == null) {
            alert("Primero marque su ruta");

        }
        else if ($(fechaRuta).val() != "" && $(horaRuta).val() != "" && end == null) {
            alert("Primero marque su ruta");
        }
        else if (($(fechaRuta).val() == "" || $(horaRuta).val() == "") && end != null) {
            alert("Debe ingresar la fecha y hora de su ruta");
        }
        else {
            alert("Se ha guardado su ruta exitosamente..");
            $(fechaRuta).val(""); $(horaRuta).val("")
            directionsDisplay.set('directions', null);
            waypts = [];
            start = null;
            end = null;
        }

    });
   
}
var cont = 0;
/*MAP_crearMapa*/
function MAP_crearMapa(lat, long, divHtml, tipoRuta){
    var myCenter = new google.maps.LatLng( parseFloat(lat), parseFloat(long) );

    

    var mapProp = {
        center:myCenter,
        zoom:17,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById(divHtml), mapProp);
    
    var imagePerson = {
        url: "img/personMarker.png",
        //size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 50)
    };

    var imageCar = {
        url: "img/carMarker.png",
        //size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(70, 70)
    };

    if(tipoRuta == "savedRuta"){
        var marker=new google.maps.Marker({
            position:myCenter,
            icon: imageCar
        });
        
        var flightPath=new google.maps.Polyline({
             path:trip,
             strokeColor:"#1E90FF",
             strokeOpacity:0.8,
             strokeWeight:6
        });

        flightPath.setMap(map);
        trip = [];

    }
    else if(tipoRuta == "newRuta"){
        
        var marker=new google.maps.Marker({
            position:myCenter,
            icon: imageCar,
            draggable:true,
            animation:google.maps.Animation.DROP
        });
        ubicarMarcadorSolicitantes(parseFloat(lat), parseFloat(long), map, imagePerson);
        
        
        directionsDisplay.setMap(map);

        google.maps.event.addListener(marker,'dragstart',dibujarRuta);  
        google.maps.event.addListener(marker,'dragend',dibujarRuta);
      
        function dibujarRuta(event) {

                if (start == null) {
                    start = new google.maps.LatLng(event.latLng.A, event.latLng.F);
                    
                    return;
                }

                else if (end == null) {
                    end = new google.maps.LatLng(event.latLng.A, event.latLng.F);
                }
                else {
                    waypts.push({
                        location: end,
                        stopover: false
                    });
                    end = new google.maps.LatLng(event.latLng.A, event.latLng.F);
                  
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
                waypts = [];
        } 
        
        /**/ 
    }
    else if(tipoRuta == "solicitar"){
        var marker=new google.maps.Marker({
            position:myCenter,
            icon: imagePerson,
            animation:google.maps.Animation.BOUNCE
        });  
        
        ubicarMarcadorOferentes(parseFloat(lat), parseFloat(long),map,imageCar);
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
    $('a[href^="#rut-"]').on('shown.bs.tab', function () {
        
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
/*FIN MAP_crearMapa*/
 
/*Nuevo avance*/
function ubicarMarcadorSolicitantes(lat1,long1,map,imagePerson){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","xml/marcadores.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    var xmlOfers = xmlDoc.getElementsByTagName("solicitante");
    
    var ubicacion, lat2, long2, distancia;
           
    for(i=0; i < xmlOfers.length; i++){

        nom = xmlOfers[i].getElementsByTagName("nombre")[0].firstChild.nodeValue;
        ubicacion= xmlOfers[i].getElementsByTagName("ubicacion")[0];
        lat2 =ubicacion.getElementsByTagName("lat")[0].firstChild.nodeValue;
        long2=ubicacion.getElementsByTagName("long")[0].firstChild.nodeValue;

        distancia = calcularDistancia(lat1, long1, lat2, long2); //devuelve distancia en Km
        distancia = distancia * 1000;                            // llevando a Mtrs.
        distancia=distancia.toFixed(2);
        /*Valida si la distancia es <= 500m*/
        if (distancia <= 500) {
           
            var marker_solic = new google.maps.Marker({
                position: new google.maps.LatLng(parseFloat(lat2), parseFloat(long2)),
                icon: imagePerson,
                animation: google.maps.Animation.BOUNCE,
                map:map

            });
            
            marker_solic.content = '<p><b>' + nom + '</b></p>' +
                                   '<p><b>Dista de ti:</b></br>' + distancia+ " Metros" +'</p>';
           
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker_solic, 'click', function() {
                infowindow.setContent(this.content);
                infowindow.open(map,this);

            }); 
        }
       
        
    }

}


function ubicarMarcadorOferentes(lat1, long1, map, imageCar) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "xml/marcadores.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    var xmlOfers = xmlDoc.getElementsByTagName("oferente");

    var ubicacion, lat2, long2, distancia;
   
    for (i = 0; i < xmlOfers.length; i++) {

        nom = xmlOfers[i].getElementsByTagName("nombre")[0].firstChild.nodeValue;
        servicio = xmlOfers[i].getElementsByTagName("servicio")[0].firstChild.nodeValue;
        ubicacion = xmlOfers[i].getElementsByTagName("ubicacion")[0];
        lat2 = ubicacion.getElementsByTagName("lat")[0].firstChild.nodeValue;
        long2 = ubicacion.getElementsByTagName("long")[0].firstChild.nodeValue;

        distancia = calcularDistancia(lat1, long1, lat2, long2);
        distancia=distancia.toFixed(2);
        /*Valida si la distancia es <= 3Km*/
        if (distancia <= 3) {
            var marker_ofer;
            

            if (servicio == "pagado") {
                
                    marker_ofer = new google.maps.Marker({
                    position: new google.maps.LatLng(parseFloat(lat2), parseFloat(long2)),
                    icon: imageCar,
                    title: "Servicio pagado",
                    animation: google.maps.Animation.BOUNCE,
                    map:map
                    });
            }
            else {
                
                    marker_ofer = new google.maps.Marker({
                    position: new google.maps.LatLng(parseFloat(lat2), parseFloat(long2)),
                    icon: imageCar,
                    title: "Servicio gratis",
                    animation: google.maps.Animation.BOUNCE,
                    map:map
                    });
                    
            }

            marker_ofer.content = '<p><b>' + nom + '</b></p>' +
                                  '<p><b>Distancia:</b> ' + distancia+ " Km" +'</p>' +
                                  '<p><b>Servicio ' + servicio + '</b></p>' +
                                  '<button style="margin-left:35px;"onclick="enviarSolicitud()">Solicitar</button>';
           
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker_ofer, 'click', function() {
                infowindow.setContent(this.content);
                infowindow.open(map,this);

            }); 
             
        }

    }
}

/*CalcularDistancia permite obtener la distancia para luego validar que se muestren en el mapa los solicitantes cuya distancia sea <=3km*/

function calcularDistancia(lat1,long1,lat2,long2){
    var radioTierra = 6371; //dado en Km
    var radLat = gradoToRad(lat2 - lat1);
    var radLong = gradoToRad(long2 - long1);
    var a =
        Math.sin(radLat / 2) * Math.sin(radLat / 2) +
        Math.cos(gradoToRad(lat1)) * Math.cos(gradoToRad(lat2)) *
        Math.sin(radLong / 2) * Math.sin(radLong / 2);

    var dist_grados = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var distancia = radioTierra * dist_grados;

    return distancia;
}

function gradoToRad(grados){
    return grados * (Math.PI / 180);
}

function enviarSolicitud(infowindow){
    alert("Solicitud enviada!");
  
}
/*Nuevo avance*/
window.addEventListener('load', MAP_initialize);
