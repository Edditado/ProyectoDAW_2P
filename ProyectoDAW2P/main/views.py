from django.shortcuts import render, render_to_response
from django.template import RequestContext
#from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from main.models import * 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
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

def salir(request):
	logout(request)
	return HttpResponseRedirect('/')