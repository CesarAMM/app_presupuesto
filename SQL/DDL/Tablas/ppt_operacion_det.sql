use presupuesto
go
-- TABLA: ppt_operacion_det
if OBJECT_ID('ppt_operacion_det') is not null 
	drop table ppt_operacion_det
go
create table ppt_operacion_det (
	opd_operacion		int			not null,
	opd_operacion_det	int			not null,
	opd_categoria		catalogo	not null,
	opd_subcategoria	catalogo	not null,
	opd_unidad			int			not null,
	opd_monto_uni		money		not null,
	opd_monto			money		not null
)
go