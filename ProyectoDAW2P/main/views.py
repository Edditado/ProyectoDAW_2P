# -*- encoding: utf-8 -*-

from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from main.models import * 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
import json
from django.core import serializers
from datetime import datetime
from suds.xsd.doctor import ImportDoctor, Import
from suds.client import Client

url = 'http://ws.espol.edu.ec/saac/wsandroid.asmx?WSDL'
impSchema = Import('http://www.w3.org/2001/XMLSchema')
impSchema.filter.add('http://tempuri.org/')
interprete = ImportDoctor(impSchema)
cliente = Client(url, doctor=interprete)
numeroMatricula = ''

def indexView(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('sistema/')
	else:	
		return render_to_response('index.html',context_instance=RequestContext(request))


@csrf_exempt
def ingresar(request):
	try:
		if request.user.is_authenticated():

			usuario= AuthUser.objects.get(id=request.user.id)
			return render_to_response('menu.html', {'usuario':usuario},context_instance=RequestContext(request))
		else:

			username=str(request.POST['username']).lower()
			password=str(request.POST['password'])

			user= authenticate(username=username, password=password)
			if(user):
				login(request, user)
				usuario= AuthUser.objects.get(id=request.user.id)
				
				
				return render_to_response('menu.html', {'usuario':usuario},context_instance=RequestContext(request))
			else:	
				return render_to_response('usuario_incorrecto.html', context_instance=RequestContext(request))
	except:
		print "error" # aqui se debe mostrar un archivo llamado error.html para mostrar errores en el servidor
		#return render_to_response('error.html', context_instance=RequestContext(request))
@csrf_exempt
def guardarRuta(request):

	if request.user.is_authenticated():

			lat_i= float(request.POST['lat_i'])
			#print type(lat_i)
			lng_i= float(request.POST['lng_i'])
			
			lat_f= float(request.POST['lat_f'])
			
			lng_f= float(request.POST['lng_f'])
			
			way = str(request.POST['way'])
			print way
			fec = str(request.POST['fecha'])
						
			hor = str(request.POST['hora'])
			
			user= AuthUser.objects.get(id=request.user.id)
			
			ruta = Ruta.objects.create(fk_user=user, fecha=fec, hora=hor)

			ruta = Ruta.objects.get(id_ruta=ruta.id_ruta)
			
			Puntos.objects.create(pto_lat=lat_i,pto_lng=lng_i,tipo="inicio",fk_ruta=ruta)
			Puntos.objects.create(pto_lat=lat_f,pto_lng=lng_f,tipo="fin",fk_ruta=ruta)
			
			print len(way)
			
			if(len(way)!=0):
				coords_list = way.split('|')
				print coords_list
				for coords in coords_list:
					coord = coords.split(',')
					lat=coord[0]
					lng=coord[1]
					lat=float(lat)
					lng=float(lng)
					Puntos.objects.create(pto_lat=lat,pto_lng=lng,tipo="camino",fk_ruta=ruta)
				

			xml = "<respuesta>Ok</respuesta>"

			return HttpResponse(xml, content_type = 'application/xml')



def salir(request):
	logout(request)
	return HttpResponseRedirect('/')


'''funcion para retornar las rutas del usuario autenticado'''
def cargarRutas(request):
	if request.user.is_authenticated():
		
		usuario= AuthUser.objects.filter(id=request.user.id) 
		rutas = Ruta.objects.filter(fk_user=usuario);
		#puntos = serializers.serialize("json", puntos)
		#rutas = serializers.serialize("json", rutas)
		
		data = {}
		for ruta in rutas:
			puntos= Puntos.objects.filter(fk_ruta=ruta.id_ruta)
			puntos= serializers.serialize("json", puntos)
			data[ruta.id_ruta]=[puntos,ruta.fecha,ruta.hora]
			
		
		return JsonResponse(data)
			
def jso(request):
	if request.user.is_authenticated():
		usr= AuthUser.objects.filter(id=request.user.id)
    	data = serializers.serialize("json", usr)
    	
    	return HttpResponse(data, content_type='application/json')



def ofernts(request):
	if request.user.is_authenticated():
		ofr= AuthUser.objects.filter(tipo='oferente').exclude(id=request.user.id)
    	datosOfer = serializers.serialize("json", ofr)
    	
    	return HttpResponse(datosOfer, content_type='application/json')



def solicits(request):
	if request.user.is_authenticated():
		sol= AuthUser.objects.filter(tipo='solicitante').exclude(id=request.user.id)
    	datosSol = serializers.serialize("json", sol)
    	
    	return HttpResponse(datosSol, content_type='application/json')

def peticiones(request):
	if request.is_ajax():

		currDT = "%s"%datetime.datetime.now()
		splited = currDT.split()
		currDate = splited[0]
		currTime = splited[1][:5]
		print ":v"
		rutas = Ruta.objects.filter(fecha=currDate).filter(hora__gte=currTime).order_by("fk_user", "hora")
		serialRutas = serializers.serialize("json", rutas)
		print rutas
		print serialRutas
		return JsonResponse({"rutas": serialRutas})

@csrf_exempt
def registro(request):
    global numeroMatricula
    usuarioU = request.POST.get('userForm')
    respuestaAutenticacion = cliente.service.autenticacion(request.POST.get('userForm'), request.POST.get('passForm'))
    if respuestaAutenticacion == True:
        respuestaMatricula = cliente.service.wsConsultaCodigoEstudiante(usuarioU)
        numeroMatricula = respuestaMatricula.diffgram.NewDataSet.MATRICULA.COD_ESTUDIANTE
        return render_to_response('formulario2.html', context_instance=RequestContext(request))
    else:
        return render_to_response('index.html', context_instance=RequestContext(request))


def datosUsuario(request,numeroMatricula):
    if request.method == 'POST':
        respuestaDatos = cliente.service.wsInfoEstudianteGeneral("numeroMatricula")
        password = request.POST['newPassword']
        last_login = "%s"%datetime.now()
        is_superuser = False
        username = respuestaDatos.diffgram.NewDataSet.ESTUDIANTE.USUARIO
        first_name = respuestaDatos.diffgram.NewDataSet.ESTUDIANTE.NOMBRES
        last_name = respuestaDatos.diffgram.NewDataSet.ESTUDIANTE.APELLIDOS
        email = respuestaDatos.diffgram.NewDataSet.ESTUDIANTE.CORREO
        is_staff = False
        is_active = True
        date_joined = "%s"%datetime.now()
        if request.POST['optradio'] == True:
            tipo = 'oferente'
        else:
            tipo = 'solicitante'
        telf = request.POST['newTelefono']
        ubi_lat = '-2.177595'
        ubi_lng = '-79.941624'

        userData = AuthUser(id='',password=password,last_login=last_login,is_superuser=id_superuser,username=username,first_name=first_name, last_name=last_name, email=email, is_staff=is_staff,is_active=is_active, date_joined=date_joined, tipo=tipo, telf=telf, ubi_lat=ubi_lat,ubi_lng=ubi_lng)
        userData.save()
        lista_editoriales = AuthUser.objects.all()
        return render_to_response('index.html', context_instance=RequestContext(request))
