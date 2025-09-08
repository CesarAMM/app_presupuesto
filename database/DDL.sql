use db_presupuesto
go

-- Esquema para tablas de presupuesto
create schema presupuesto
go

-- tablas de presupuesto
create table presupuesto.prt_presupuesto (
	prt_presupuesto		int				not null,
	prt_descripcion		varchar(30)		not null,
	prt_monto_egreso	money			not null check (prt_monto_egreso >= 0),
	prt_monto_ingreso	money			not null check (prt_monto_ingreso >= 0),
	prt_fecha_creada	datetime		not null,
	prt_fecha_ult_mod	datetime		not null,
	prt_fecha_ini		datetime		not null,
	prt_fecha_fin		datetime		not null,
	prt_usuario			varchar(10)		not null
)
go

create table presupuesto.prt_presupuesto_det (
	prd_presupuesto			int			not null,
	prd_presupuesto_det		int			not null,
	prd_tipo				varchar(10) not null,
	prd_subtipo				varchar(10) not null,
	prd_categoria			varchar(10) not null,
	prd_subcategoria		varchar(10) not null,
	prd_monto				money		not null
)
go

create index inx_presupuesto on presupuesto.prt_presupuesto (prt_presupuesto)
go
create index inx_presupuesto_dev on presupuesto.prt_presupuesto_det (prd_presupuesto, prd_presupuesto_det)
go

-- Esquema 
create schema metadata
go


-- tablas de metadata
create table metadata.met_tabla(
	codigo			int			not null,
	tabla			varchar(30) not null,
	descripcion		varchar(64) not null
)

create table metadata.met_catalogo(
	tabla		int				not null,
	codigo		varchar(10)		not null,
	valor		varchar(24)		not null,
	estado		varchar(1)		not null
)

create index idx_tabla_codigo
on metadata.met_tabla (codigo)
go
create index idx_tabla_tabla
on metadata.met_tabla (tabla)
go
create index idx_catalogo
on metadata.met_catalogo (tabla, codigo)
go

create table metadata.met_parametro (
	pm_codigo			varchar(10)		not null,
	pm_descripcion		varchar(64)		not null,
	pm_tipo				varchar(30)		not null,
	pm_valor			varchar(64)		not null,
	pm_estado			varchar(10)		not null
)
go
create index idx_met_parametro
on metadata.met_parametro (pm_codigo)
go

create table metadata.met_correlativo(
	cr_tabla		varchar(34)		not null,
	cr_correlativo	int				not null
)
go

create index idx_met_correlativo
on metadata.met_correlativo (cr_tabla)
go
