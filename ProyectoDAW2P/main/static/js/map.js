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
                    //alert(typeof(start.lat()));
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

    $('a[href^="#' + divHtml + '"]').on('shown.bs.tab', function () {
       
       	/* Trigger map resize event */
       	google.maps.event.trigger(map, 'resize');
     	map.setCenter(myCenter);
    });
}	    

function guardarRuta(){

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

            fecha= $("#fechaRuta").val();    
            hora= $("#horaRuta").val();

                          
            var way = "";
            for(var i = 0; i < waypts.length; i++){
                coord_lat =waypts[i].location.lat();
                coord_lng =waypts[i].location.lng();
                coord = coord_lat + "," + coord_lng;
                
                way = way + coord + "|";        
            }    
            way=way.substring(0, way.length-1);
            alert(way);
            var xmlhttp; 

            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange=function(){

                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    xml = xmlhttp.responseXML;
                    if (xml){
                            resultado = xml.getElementsByTagName("respuesta")[0].firstChild.nodeValue;
                            if (resultado != "Ok")
                                alert('Error al enviar resultados.');
                            else{
                                alert("Se ha guardado su ruta exitosamente..");
                                //window.location = "/sistema/reservaciones/activas/";
                            }
                    }
                }
            }

            xmlhttp.open("POST","guardar/",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");


            
            string = "lat_i=" + start.lat() + "&lng_i=" + start.lng() + "&lat_f=" + end.lat() + "&lng_f=" + end.lng()  + "&fecha=" + fecha + "&hora=" + hora + "&way=" + way;
           
            string = encodeURI(string);

            //string = encodeURIComponent(string);

            xmlhttp.send(string);
           
           /* alert("Se ha guardado su ruta exitosamente..");
            $(fechaRuta).val(""); $(horaRuta).val("")
            directionsDisplay.set('directions', null);
            waypts = [];
            start = null;
            end = null;*/
     }
}

function ubicarMarcadorOferentes(lat1, long1, map, imageCar) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "oferentes/", false);  
    xmlhttp.send();    
    var t_oferents = JSON.parse(xmlhttp.responseText); 
    
    var nom, lat2, long2, distancia;
    
    for (i = 0; i < t_oferents.length; i++) {
        var campos_ofer= t_oferents[i].fields; 
        nom = campos_ofer.first_name;  
        lat2 = campos_ofer.ubi_lat;
        long2 = campos_ofer.ubi_lng;
        distancia = calcularDistancia(lat1, long1, lat2, long2); 
        distancia=distancia.toFixed(2);
        /*Valida si la distancia es <= 3Km*/  
        if (distancia <= 3) {
            var marker_ofer;
            
                    marker_ofer = new google.maps.Marker({
                    position: new google.maps.LatLng(parseFloat(lat2), parseFloat(long2)),
                    icon: imageCar,
                    animation: google.maps.Animation.BOUNCE,
                    map:map
                    });
            

            marker_ofer.content = '<p><b>' + nom + '</b></p>' +
                                  '<p><b>Distancia:</b> ' + distancia+ " Km" +'</p>' +
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

window.addEventListener('load', MAP_initialize);    