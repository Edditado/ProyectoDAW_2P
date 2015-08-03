# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [app_label]'
# into your database.
from __future__ import unicode_literals

from django.db import models


class AuthGroup(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    group = models.ForeignKey(AuthGroup)
    permission = models.ForeignKey('AuthPermission')

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'


class AuthPermission(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    name = models.CharField(max_length=50)
    content_type = models.ForeignKey('DjangoContentType')
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'


class AuthUser(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField()
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=75)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    user = models.ForeignKey(AuthUser)
    group = models.ForeignKey(AuthGroup)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'


class AuthUserUserPermissions(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    user = models.ForeignKey(AuthUser)
    permission = models.ForeignKey(AuthPermission)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'


class Carro(models.Model):
    id_carro = models.IntegerField(primary_key=True)
    placa = models.TextField(blank=True)
    fkc_user = models.ForeignKey('Usuario', db_column='fkc_user', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'carro'


class Cuenta(models.Model):
    id_cuenta = models.IntegerField(primary_key=True)
    cuenta = models.TextField(blank=True)
    tipo = models.TextField(blank=True)
    fk_cta_user = models.ForeignKey('Usuario', db_column='fk_cta_user', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cuenta'


class DjangoAdminLog(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', blank=True, null=True)
    user = models.ForeignKey(AuthUser)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    name = models.CharField(max_length=100)
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'


class DjangoMigrations(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Mensaje(models.Model):
    id_sms = models.IntegerField(primary_key=True)
    contenido = models.TextField(blank=True)
    fk_peticion = models.ForeignKey('Peticion', db_column='fk_peticion', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mensaje'


class Peticion(models.Model):
    id_peticion = models.IntegerField(primary_key=True)
    fk_oferente = models.ForeignKey('Usuario', db_column='fk_oferente', blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    hora = models.TimeField(blank=True, null=True)
    fk_solicitante = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'peticion'


class Ruta(models.Model):
    id_ruta = models.IntegerField(primary_key=True)
    origen = models.TextField(blank=True)  # This field type is a guess.
    fin = models.TextField(blank=True)  # This field type is a guess.
    camino = models.TextField(blank=True)  # This field type is a guess.
    fecha = models.DateField(blank=True, null=True)
    hora = models.TimeField(blank=True, null=True)
    fk_user = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ruta'


class Usuario(models.Model):
    id_user = models.IntegerField(primary_key=True)
    nombre = models.TextField(blank=True)
    apellido = models.TextField(blank=True)
    telf = models.IntegerField(blank=True, null=True)
    tipo = models.TextField(blank=True)
    user = models.TextField(blank=True)

    class Meta:
        managed = False
        db_table = 'usuario'
