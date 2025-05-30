use presupuesto
go
-- TABLA: ppt_tabla
if OBJECT_ID('ppt_tabla') is not null 
	drop table ppt_tabla
go

create table ppt_tabla(
	tb_codigo	int			not null,
	tb_tabla	varchar(24)	not null
)
go
create unique index idx_tabla_tb_codigo 
	on ppt_tabla (tb_codigo)
go
create unique index idx_tabla_tb_tabla 
	on ppt_tabla (tb_tabla)
go

insert into ppt_tabla (tb_codigo, tb_tabla) values
	(1, 'ppt_toperacion'),
	(2, 'ppt_categoria'),
	(3, 'ppt_tcategoria'),
	(4, 'ppt_subcategoria')
go