use presupuesto
go

if OBJECT_ID('ppt_operacion') is not null 
	drop table ppt_operacion

go
create table ppt_operacion(
	op_operacion		int			not null,
	op_toperacion		catalogo	not null,	-- INGRESO, EGRESO
	op_categoria		catalogo	not null,	-- FIJO -- VARIABLE -- OCACIONAL
	op_tcategoria		catalogo	not null,
	op_subcategoria		catalogo	not null,
	op_cuenta			catalogo	not null,

	op_ing_fecha		datetime	not null,
	op_fac_fecha		datetime	not null,
	op_monto			money		not null,
	op_responsable		catalogo	not null, -- GASTO HOGAR, DANIELA, CESAR
	op_ing_user			catalogo	not null
)
go
create unique index idx_operacion on ppt_operacion(op_operacion)
go
