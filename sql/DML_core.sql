use dp_presupuesto;
go
create schema core;
go
if OBJECT_ID('core.presupuesto') is not null
	drop table core.presupuesto
go
create table core.presupuesto(
	presupuesto		int			not null primary key,
	fecha_ing		datetime	not null,
	fecha_upd		datetime	null,
	fecha_ini		datetime	not null,
	fecha_fin		datetime	not null,
	total_ingreso	money		not null,
	total_egreso	money		not null,
	usuario			varchar(15) not null
)
go
if OBJECT_ID('core.matriz_presupuesto') is not null
	drop table core.matriz_presupuesto
go
create table core.matriz_presupuesto
(
	presupuesto		int				not null,
	indice			int				not null,
	operacion		varchar(10)		not null,
	frecuencia		varchar(10)		not null,
	categoria		varchar(10)		not null,
	subcategoria	varchar(10) 	not null,
	monto			money			not null,
	descripcion		varchar(64)		null 
)
go
create nonclustered index dix_matriz_presupuesto 
ON core.matriz_presupuesto (presupuesto, indice)
go

if OBJECT_ID('core.operacion') is not null
	drop table core.operacion
go
create table core.operacion (
	operacion			int 		primary key,
	tipo_operacion 		varchar(10) not null,
	frecuencia			varchar(10) not null,
	categoria			varchar(10) not null,
	subcategoria		varchar(10) not null,
	descripcion			varchar(10) null,
	monto				money		not null,
	fecha_ope			datetime	not null,
	fecha_ini			datetime	not null
)
go

if OBJECT_ID('core.operacion_det') is not null
	drop table core.operacion_det
go
create table core.operacion_det(
	operacion			int			not null,
	operacion_det		int 		not null,
	detalle				varchar(32) not null,
	unidad				varchar(10) not null,
	cantidad			float 		not null,
	precio_unidad		money 		not null,
	precio_final		money 		not null

)
go
create nonclustered index dix_operacion_det 
ON core.operacion_det (operacion, operacion_det)

go
if object_id('core.usuario') is not null
	drop table core.usuario
go

create table core.usuario (
	usuario			int not null primary key,
	user_login		varchar(15) not null,
	password_has	varchar(255) not null,
	rol				int not null,
	estado			smallint not null default 1
)
go


insert into core.usuario (usuario, user_login, rol, password_has)
values (1, 'cmazariegos', 1, '123456')
