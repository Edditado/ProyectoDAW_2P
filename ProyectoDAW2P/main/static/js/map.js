//vars necesarias y exclusivas para nueva ruta
var start = null; 
var end = null;
var waypts = [];  
//


function MAP_initialize(){
    
    MAP_crearMapa("divSolic", "solicitar");
    MAP_crearMapa("nRuta", "newRuta");

   
    /*peticion para ir a cargarRutas(request) de views.py y retorna data*/
    $.get("rutas/",function(data){
        
        var dictRutas = {};

        //La data viene ordenada desde python por tener int como clave y javascript por defecto los lee ordenadamente 
        for( key in data){ 

            datos = data[key];
            puntos = datos[0]; /*permite obtener un array de puntos*/
            tb_puntos = JSON.parse(puntos); // DES-serializar datos(puntos de ruta) con json.parse
            var inicio, fin;
            var array_camino = [];
            
            for (i = 0; i < tb_puntos.length; i++) {
                
                var campos_puntos= tb_puntos[i].fields;
                
                pto_lat = campos_puntos.pto_lat;
                pto_lng = campos_puntos.pto_lng;
                tipo_punto = campos_puntos.tipo; 

                if(tipo_punto == "inicio"){
                    inicio = new google.maps.LatLng(parseFloat(pto_lat), parseFloat(pto_lng));
                }
                else if(tipo_punto == "fin"){
                    fin = new google.maps.LatLng(parseFloat(pto_lat), parseFloat(pto_lng));
                }
                else{
                    var camino = new google.maps.LatLng(parseFloat(pto_lat), parseFloat(pto_lng));
                 
                    array_camino.push({
                        location: camino,
                        stopover: false
                    });
                }    
            }
        
            var request = {
                origin: inicio,
                destination: fin,
                waypoints: array_camino,
                // optimizeWaypoints: true, /*esta propiedad es usada para encontrar la menor distancia entre dos puntos*/
                travelMode: google.maps.TravelMode.DRIVING,

            };
            
            dictRutas[key] = request;/*Ej. {'1':request,'2':request,...}*/
        
        }
       
       mostrar_rutaTb(dictRutas);
    });
}
/*Mostrar ruta en tablas*/
function mostrar_rutaTb(dictRutas){

    var directionsService = new google.maps.DirectionsService();    
    var arrayKeys = [];
        arrayKeys = Object.keys(dictRutas).reverse();/*reverse, para mostrar en orden descendente las rutas guardadas*/
    var num_rutas = arrayKeys.length; /*almacena el numero de keys. Se usará para obtener el id de cada ruta.*/
    var n = arrayKeys.length;
    
    $('#tbRutas tbody tr').remove(); /*limpio la tabla antes de mostrar los datos*/    
    
    for(i=0; i < n; i++){

        key = arrayKeys[i];

        if(key in dictRutas){
        
            request = dictRutas[key];
        
            directionsService.route(request, function (response, status) {
                
                if (status == google.maps.DirectionsStatus.OK) {
                    var route = response.routes[0];
                    
                    for (var i = 0; i < route.legs.length; i++) {
                                
                        var routeSegment = n;/*Para enumerar cada ruta de usuario al momento de presentarselas*/
                        var texto="" ;
                        texto += '<b> Ruta: ' + routeSegment + '</b><br>';
                        texto += '<b>Desde: </b>'+ route.legs[i].start_address + ' <b>Hasta: </b>';
                        texto += route.legs[i].end_address + '<br>';
                        texto += route.legs[i].distance.text + '<br><br>';
                    
                        var p_ruta = $('<p></p>').append(texto);
                        var td1 = $('<td></td>'); var td2 = $('<td></td>');
                        var tr = $('<tr></tr>');
                    
                        var a = $('<a></a>');
                        var p = $('<p></p>').text("Ver en mapa");
                        a.append(p); a.attr("href","javascript:mostrar_rutaMapa("+ arrayKeys[num_rutas-n] +")");

                        td1.append(p_ruta); td2.append(a);
                        tr.append(td1); tr.append(td2);
                        
                        $('#tbRutas tbody').append(tr)
                    
                    }
                    n--;
                }
            });

        }
        
    }
    
}
/*Mostrar ruta en mapa mediante un popup*/
function mostrar_rutaMapa(id_ruta){
    
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    
    $.get("rutas/",function(data){
       
        for( key in data){ 
            
            if(key == id_ruta){    
                
                datos = data[key];
                puntos = datos[0]; /*permite obtener el array de puntos*/

                tb_puntos = JSON.parse(puntos); // DES-serializar datos(puntos de ruta) con json.parse
                var inicio, fin;
                var array_camino = [];
                var fk;         /*almacenará fk de ruta para luego obtener la hora y la fecha*/
                for (i = 0; i < tb_puntos.length; i++) {
                    
                    var campos_puntos= tb_puntos[i].fields;
                    pto_lat = campos_puntos.pto_lat;
                    pto_lng = campos_puntos.pto_lng;
                    tipo_punto = campos_puntos.tipo; 
                    //fk = campos_puntos.fk_ruta;
                    
                    if(tipo_punto == "inicio"){
                        inicio = new google.maps.LatLng(parseFloat(pto_lat), parseFloat(pto_lng));
                    }
                    else if(tipo_punto == "fin"){
                        fin = new google.maps.LatLng(parseFloat(pto_lat), parseFloat(pto_lng));
                    }
                    else{
                        var camino = new google.maps.LatLng(parseFloat(pto_lat), parseFloat(pto_lng));
                     
                        array_camino.push({
                            location: camino,
                            stopover: false
                        });
                    }    
                }
            
                var myCenter = fin;

                var mapProp = {
                    center: myCenter,
                    zoom: 17,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(document.getElementById("saved-ruta"), mapProp);

                var marker = new google.maps.Marker({
                    position: myCenter,
                  
                });

                directionsDisplay.setMap(map);
                
                var request = {
                    origin: inicio,
                    destination: fin,
                    waypoints: array_camino,
                    // optimizeWaypoints: true, /*esta propiedad es usada para encontrar la menor distancia entre dos puntos*/
                    travelMode: google.maps.TravelMode.DRIVING,

                };
                directionsService.route(request, function (response, status) {
                    //alert(status);
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        $("#popup-ruta").modal();
                        $("#saved-fecha").val(datos[1]);/*muestra fecha y abajo hora la respectiva ruta que se esta mostraran*/
                        $("#saved-hora").val(datos[2]);
                    }
                });
                /*Permite hacer un render al mapa para mostrar el recorrido*/    
                $("#popup-ruta").on('mouseenter', function () {
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(myCenter);
                    map.setZoom(14);
                });
            }

        }
       
       
    });
}

function MAP_crearMapa(divHtml, tipoRuta){
    
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

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
        var lat = "-2.172637";
        var long = "-79.940418";
        var myCenter = new google.maps.LatLng( parseFloat(lat), parseFloat(long) );

        var mapProp = {
            center:myCenter,
            zoom:17,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById(divHtml), mapProp);

        var marker=new google.maps.Marker({
            position:myCenter,
            icon: imageCar,
            draggable:true,
            title:"Arrastrame!",
            map:map,
            animation:google.maps.Animation.DROP
        });

        var Distsel = document.getElementById("opDistSol");
        var distanciaSel = Distsel.options[Distsel.selectedIndex];
        var distanciaCalc=parseFloat(distanciaSel.value);
        ubicarMarcadorSolicitantes(parseFloat(lat), parseFloat(long), map, imagePerson,distanciaCalc);
        
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
                //optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING

            };

            directionsService.route(request, function (response, status) {
                
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
            
        } 

    }
    else if(tipoRuta == "solicitar"){
        var lat = "-2.172637";
        var lng = "-79.940418";
        var myCenter = new google.maps.LatLng( parseFloat(lat), parseFloat(lng) );

        var mapProp = {
            center:myCenter,
            zoom:17,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById(divHtml), mapProp);

        var marker=new google.maps.Marker({
            position:myCenter,
            icon: imagePerson,
            map:map,
            animation:google.maps.Animation.BOUNCE
    	});

    var Distsel = document.getElementById("opDistOf");
    var distanciaSel = Distsel.options[Distsel.selectedIndex];
    var distanciaCalc=parseFloat(distanciaSel.value);
    ubicarMarcadorOferentes(parseFloat(lat), parseFloat(long),map,imageCar,distanciaCalc);
	
    }	
	
    
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

function muestraPorDistanciaOferentes(){
        MAP_crearMapa("-2.172637","-79.940418", "divSolic", "solicitar");
} 
function muestraPorDistanciaSolicitantes(){
        MAP_crearMapa("-2.172637","-79.940418", "nRuta", "newRuta");
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
            //alert(way);
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

                                start=null; end=null; waypts=[];
                                
                                $("a[href^=#rutas_guardadas]").on("shown.bs.tab",function(){
                                        MAP_initialize();   
                                });
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



function ubicarMarcadorOferentes(lat1, long1, map, imageCar, distanciaCalc) {

    /*$.get("peticiones/", function(data){
        alert(data)
    });*/
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
        //Valida si la distancia es <= la distancia seleccionada
        if (distancia <= distanciaCalc) {
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




function ubicarMarcadorSolicitantes(lat1,long1,map,imagePerson, distanciaCalc){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "solicitantes/", false);  
    xmlhttp.send();    
    var t_solic = JSON.parse(xmlhttp.responseText); 
    
    var nom, lat2, long2, distancia;
    
    for (i = 0; i < t_solic.length; i++) {
        var campos_sol= t_solic[i].fields; 
        nom = campos_sol.first_name;  
        lat2 = campos_sol.ubi_lat;
        long2 = campos_sol.ubi_lng;
        distancia = calcularDistancia(lat1, long1, lat2, long2); 
        distancia = distancia * 1000;                            // llevando a Mtrs.
        distancia=distancia.toFixed(2);
        /*Valida si la distancia es <= 500m*/
        if (distancia <= (distanciaCalc*1000)) {
           
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