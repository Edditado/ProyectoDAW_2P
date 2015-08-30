from django.conf.urls import patterns, include, url
from django.contrib import admin
from main import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'ProyectoDAW2P.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.indexView),
    url(r'^sistema/$', views.ingresar),
    url(r'^sistema/guardar/$', views.guardarRuta),
    url(r'^salir/$', views.salir),
    url(r'^sistema/rutas/$', views.cargarRutas),
    url(r'^sistema/datos/$', views.jso),
    url(r'^sistema/oferentes/$', views.ofernts),
    url(r'^sistema/solicitantes/$', views.solicits),
    url(r'^sistema/peticiones/$', views.peticiones),
)
