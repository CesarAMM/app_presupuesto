use db_presupuesto
go

insert into metadata.met_tabla (codigo, tabla, descripcion)
values (1, 'met_toperacion', 'Tipo de Operacion')

insert into metadata.met_catalogo (tabla, codigo, valor, estado)
values	(1, '1', 'Ingreso', 'V'),
		(1, '2', 'Egreso', 'V')
go