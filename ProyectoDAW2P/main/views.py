from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect

# Create your views here.
class IndexView(TemplateView):
	template_name = "index.html"

	def post(self, request):
		return HttpResponseRedirect('/menu/')


class MenuView(TemplateView):
	template_name = "menu.html"
