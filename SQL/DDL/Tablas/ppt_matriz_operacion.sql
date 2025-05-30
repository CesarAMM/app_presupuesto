use presupuesto
go
-- TABLA: ppt_matriz_operacion
if OBJECT_ID('ppt_matriz_operacion') is not null 
	drop table ppt_matriz_operacion
go
create table ppt_matriz_operacion (
	mo_toperacion		catalogo	not null,
	mo_categoria		catalogo	not null,
	mo_tcategoria		catalogo	not null,
	mo_subcategoria		catalogo	 not null
)

create unique index indx_matriz_operacion
	on ppt_matriz_operacion (mo_toperacion, mo_categoria, mo_tcategoria, mo_subcategoria)
go


insert into ppt_matriz_operacion (mo_toperacion, mo_categoria, mo_tcategoria, mo_subcategoria)
values	('I', 'F', '1', '1'),
		('I', 'F', '1', '2'),
		('I', 'O', '9', '1'),
		('I', 'O', '9', '2'),
		('E', 'V', '3', '5'),
		('E', 'V', '2', '9'),
		('E', 'V', '3', '15'),
		('E', 'V', '8', '8'),
		('E', 'V', '8', '16'),
		('E', 'F', '2', '4'),
		('E', 'F', '2', '10'),
		('E', 'F', '3', '6'),
		('E', 'F', '3', '17'),
		('E', 'F', '3', '7'),
		('E', 'F', '5', '3'),
		('E', 'F', '6', '1'),
		('E', 'F', '6', '2'),
		('E', 'F', '6', '12'),
		('E', 'F', '6', '13'),
		('E', 'F', '7', '14'),
		('E', 'O', '2', '11'),
		('E', 'O', '3', '17')

				
go

select	a.ca_codigo,
		a.ca_valor,
		b.ca_codigo, 
		b.ca_valor, 
		c.ca_codigo,
		c.ca_valor, 
		d.ca_codigo,
		d.ca_valor 
from	ppt_matriz_operacion,
		ppt_catalogo a,
		ppt_catalogo b,
		ppt_catalogo c,
		ppt_catalogo d
where mo_toperacion = a.ca_codigo
and a.ca_tabla = 1
and mo_categoria= b.ca_codigo
and b.ca_tabla = 2
and mo_tcategoria = c.ca_codigo
and c.ca_tabla = 3
and mo_subcategoria = d.ca_codigo
and d.ca_tabla = 4
	   