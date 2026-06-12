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