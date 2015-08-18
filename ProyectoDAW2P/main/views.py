# -*- encoding: utf-8 -*-

from django.shortcuts import render, render_to_response
from django.template import RequestContext
#from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect, HttpResponse
from main.models import * 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
import json
from django.core import serializers

#import json
#from django.core import serializers
# Create your views here.
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


'''def prueba(request):
	if request.user.is_authenticated:
		usu=AuthUser.objects.get(id=request.user.id)
		data = serializers.serialize('json', usu)
		print"123"
		return HttpResponse(data, content_type ='application/json')'''

def salir(request):
	logout(request)
	return HttpResponseRedirect('/')





def jso(request):
	if request.user.is_authenticated():
		usr= AuthUser.objects.filter(id=request.user.id)
    	data = serializers.serialize("json", usr)
    	print data
    	return HttpResponse(data, content_type='application/json')



def ofernts(request):
	if request.user.is_authenticated():
		ofr= AuthUser.objects.filter(tipo='oferente')
    	data2 = serializers.serialize("json", ofr)
    	print data2
    	return HttpResponse(data2, content_type='application/json')