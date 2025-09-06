use presupuesto
go
-- TABLA: ppt_catalogo
if OBJECT_ID('ppt_catalogo') is not null 
	drop table ppt_catalogo
go

create table ppt_catalogo(
	ca_tabla	int			not null,
	ca_codigo	catalogo	not null,
	ca_valor	varchar(24)	not null,
	ca_estado	catalogo	not null
)
go

create unique index idx_tabla_tb_codigo 
	on ppt_catalogo(ca_tabla, ca_codigo)
go

declare @w_tabla int

select @w_tabla = tb_codigo
from ppt_tabla
where tb_tabla = 'ppt_cuenta'

insert into ppt_catalogo (ca_tabla, ca_codigo, ca_valor, ca_estado) 
values	(@w_tabla, 'CABDR', 'CABDR-4364117745', 'V'),
		(@w_tabla, 'TCBI', 'TCBI-1490193131', 'V'),
		(@w_tabla, 'TCBDR', 'TCBDR-40481347', 'V')
	
go
declare @w_tabla int

select @w_tabla = tb_codigo
from ppt_tabla
where tb_tabla = 'ppt_toperacion'

insert into ppt_catalogo (ca_tabla, ca_codigo, ca_valor, ca_estado) 
values	(@w_tabla, 'I', 'INGRESO', 'V'),
		(@w_tabla, 'E', 'EGRESO', 'V')
go

declare @w_tabla int

select @w_tabla = tb_codigo
from ppt_tabla
where tb_tabla = 'ppt_categoria'

insert into ppt_catalogo (ca_tabla, ca_codigo, ca_valor, ca_estado) 
values	(@w_tabla, 'F', 'FIJO', 'V'),
		(@w_tabla, 'V', 'VARIABLE', 'V'),
		(@w_tabla, 'O', 'OCACIONALES', 'V')
go

declare @w_tabla int

select @w_tabla = tb_codigo
from ppt_tabla
where tb_tabla = 'ppt_tcategoria'

insert into ppt_catalogo (ca_tabla, ca_codigo, ca_valor, ca_estado) 
values	(@w_tabla, '1', 'SALARIO',		'V'),
		(@w_tabla, '2', 'PAGO',			'V'),
		(@w_tabla, '3', 'SERVICIO',		'V'),
		(@w_tabla, '4', 'INTERES',		'V'),
		(@w_tabla, '5',	'PRESTAMO',		'V'),
		(@w_tabla, '6',	'QUINCENAS',	'V'),
		(@w_tabla, '7',	'AHORRO',		'V'),
		(@w_tabla, '8', 'COMPRAS',		'V'),
		(@w_tabla, '9',	'BONO',			'V')
		
go
declare @w_tabla int

select @w_tabla = tb_codigo
from ppt_tabla
where tb_tabla = 'ppt_subcategoria'

insert into ppt_catalogo (ca_tabla, ca_codigo, ca_valor, ca_estado) 
values	(@w_tabla, '1',		'DANIELA',				'V'),
		(@w_tabla, '2',		'CESAR',				'V'),
		(@w_tabla, '3',		'HIPOTECA',				'V'),
		(@w_tabla, '4',		'MANTENIMIENTO',		'V'),
		(@w_tabla, '5',		'LUZ',					'V'),
		(@w_tabla, '6',		'INTERNET CASA',		'V'),
		(@w_tabla, '7',		'TELEFONO',				'V'),
		(@w_tabla, '8',		'SUPER',				'V'),
		(@w_tabla, '9',		'TARJETA CREDITO',		'V'),
		(@w_tabla, '10',	'UNI DANIELA',			'V'),
		(@w_tabla, '11',	'UNI CESAR',			'V'),
		(@w_tabla, '12',	'TONNY',				'V'),
		(@w_tabla, '13',	'SILVIA',				'V'),
		(@w_tabla, '14',	'PLAZO FIJO',			'V'),
		(@w_tabla, '15',	'MOTO',					'V'),
		(@w_tabla, '16',	'GASOLINA',				'V'),
		(@w_tabla, '17',	'STREAMING',			'V'),
		(@w_tabla, '18',	'ADS',					'V'),
		(@w_tabla, '19',	'MANTENI CUENTA',		'V')