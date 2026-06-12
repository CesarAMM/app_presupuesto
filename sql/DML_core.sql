use dp_presupuesto;
go
create schema core;
go
if OBJECT_ID('core.presupuesto') is not null
	drop table core.presupuesto
go
create table core.presupuesto (
	presupuesto int			not null primary key,
	fecha_ing	datetime	default getdate(),
	fecha_upd	datetime	null,
	fecha_ini	datetime	not null,
	fecha_fin	datetime	not null
)
go
if OBJECT_ID('core.matriz_presupuesto') is not null
	drop table core.matriz_presupuesto
go
create table core.matriz_presupuesto
(
	presupuesto		int				not null,
	indice			int				not null,
	operacion		int				not null,
	frecuencia		int				not null,
	transaccion		varchar(10)		not null,
	monto			money			not null,
	descripcion		varchar(64)		null 
)
go
create nonclustered index dix_matriz_presupuesto 
ON core.matriz_presupuesto (presupuesto, indice)
go

use dp_presupuesto
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
