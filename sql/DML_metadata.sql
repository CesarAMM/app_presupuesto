use dp_presupuesto
go

-- create schema metadata
go

/*INICIO CREACION DE TABLA METADATA.TABLA*/
if OBJECT_ID('metadata.tabla') is not null
	drop table metadata.tabla
go

create table metadata.tabla(
	codigo			int not null,
	tabla			varchar(32) not null,
	descripcion		varchar(64) not null
)
create unique index id_tabla001
on metadata.tabla(codigo)
go
/*FIN CREACION DE TABLA METADATA.TABLA*/

/*INICIO CREACION DE TABLA METADATA.CATALOGO*/
if OBJECT_ID('metadata.catalogo') is not null
	drop table metadata.catalogo
go

create table metadata.catalogo (
	tabla		int not null,
	codigo		int not null,
	valor		varchar(32) not null,
	estado		smallint not null
)
go
create unique index idx_catalogo001
on metadata.catalogo(tabla, codigo)
go
/*FIN CREACION DE TABLA METADATA.TABLA*/

/*INICIO PARAMETRIZACION METADATA.TABLA Y METADATA.CATALOGO*/
insert into metadata.tabla values
(1, 'tbl_estado', 'Estados Globales')

insert into metadata.catalogo values 
(1, 0, 'BLOQUEADO', 1),
(1, 1, 'HABILITADO', 1)


-- DML: Tipo Transaccion
insert into metadata.tabla values
(2, 'tbl_tipo_transaccion', 'Tipo de transacción')

insert into metadata.catalogo values 
(2, 1, 'FIJO', 1),
(2, 2, 'VARIABLE', 1),
(2, 3, 'OCACIONAL', 1)
go

insert into metadata.tabla values
(3, 'tbl_rol', 'Roles registrados')

insert into metadata.catalogo values 
(3, 1, 'ADMINISTRADOR', 1),
(3, 2, 'CONSULTA', 1)

GO
	select * 
	from metadata.tabla t
	inner join metadata.catalogo c on t.codigo = c.tabla
GO
/*FIN PARAMETRIZACION METADATA.TABLA Y METADATA.CATALOGO*/

/*INICIO CREACION METADATA.CLASIFICACION_GASTO */
if OBJECT_ID('metadata.clasificacion_gasto') is not null
	drop table metadata.clasificacion_gasto

create table metadata.clasificacion_gasto(
	clasificacion	varchar(10)		primary key,
	valor			varchar(32)		not null,
	padre			varchar(10)		null,
	estado			smallint		not null default 1,
	detalle_gasto	char(1)			not null default 'N',
	ahorro			char(1)			not null default 'N',
	fijo			char(1)			not null default 'N',
	variable 		char(1)			not null default 'N',
	ocacional 		char(1) 		not null default 'N'

	constraint FK_clasificacion_padre FOREIGN KEY (padre)
		references metadata.clasificacion_gasto(clasificacion)
)
go

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
	(1, 'INGRESO', NULL),
	(2, 'EGRESO', NULL)

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
	(101, 'SALARIO', 	1),
	(102, 'DIFERIDO', 	1),
	(103, 'AGUINALDO', 	1),
	(104, 'BONO 14', 	1),
	(105, 'BONO', 		1),
	(106, 'AHORRO', 	1)

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre, fijo, variable, ocacional) values 
	(10101, 'CESAR', 			101, 	'S', 'N', 'N'),
	(10102, 'DANIELA', 			101, 	'S', 'N', 'N'),
	(10201, 'CESAR', 			102, 	'N', 'N', 'S'),
	(10202, 'DANIELA', 			102, 	'N', 'N', 'S'),
	(10301, 'CESAR', 			103, 	'N', 'N', 'S'),
	(10302, 'DANIELA', 			103, 	'N', 'N', 'S'),
	(10401, 'CESAR', 			104, 	'N', 'N', 'S'),
	(10402, 'DANIELA', 			104, 	'N', 'N', 'S'),
	(10501, 'CESAR', 			105, 	'N', 'N', 'S'),
	(10502, 'DANIELA', 			105, 	'N', 'N', 'S'),
	(10601, 'COPE BANRURAL', 	106,	'N', 'N', 'N'),
	(10602, 'FONDO RETIRO', 	106, 	'N', 'N', 'N')

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre, ahorro, fijo, variable, ocacional) values
	(1060101, 'APORTE', 	10601, 'S', 	'S', 'N', 'S'),
	(1060102, 'INTERESES', 	10601, 'S', 	'N', 'N', 'S'),
	(1060201, 'APORTE', 	10602, 'S', 	'S', 'N', 'S'),
	(1060202, 'INTERESES', 	10602, 'S', 	'N', 'S', 'N')


	insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
	(201, 'SERVICIO', 	2),
	(202, 'DEUDA', 		2),
	(203, 'AHORRO', 	2),
	(204, 'VEHICULO', 	2),
	(205, 'BANCO', 		2),
	(206, 'COMPRA', 	2),
	(207, 'MESADA', 	2)

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre, fijo, variable, ocacional) values 
	(20101, 'MANTENIMIENTO', 	201, 	'S', 'N', 'N'), 
	(20102, 'CLARO CELULAR',	201, 	'S', 'N', 'N'), 
	(20103, 'CLARO HOGAR', 		201, 	'S', 'N', 'N'),
	(20104, 'LUZ', 				201, 	'N', 'S', 'N'), 
	(20105, 'STREAMING', 		201, 	'S', 'N', 'N')

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre, fijo, variable, ocacional) values 
	(20201, 'HIPOTECA', 			202, 'S', 'N', 'N'), 
	(20202, 'VISACUOTAS', 			202, 'S', 'N', 'N'),
	(20203, 'EXTRAFINANCIAMIENTO', 	202, 'S', 'N', 'N'),
	(20204, 'CREDITO', 				202, 'S', 'N', 'N')

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values
	(20301, 'COPE BANRURAL', 	203),
	(20302, 'FONDO RETIRO', 	203)

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre, ahorro, fijo, variable, ocacional) values
	(203011, 'APORTE', 		20301, 'S', 	'S', 'N', 'S'),
	(203012, 'INTERESES', 	20301, 'S', 	'N', 'S', 'N'),
	(203021, 'APORTE', 		20302, 'S', 	'S', 'N', 'S'),
	(203022, 'INTERESES', 	20302, 'S', 	'N', 'S', 'N')

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values
	(20401, 'MOTO', 204),
	(20402, 'CARRO', 204)

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre, fijo, variable, ocacional) values
	(204011, 'GASOLINA', 20401, 'N', 'S', 'N'),
	(204012, 'SERVICIO', 20401, 'N', 'N', 'S'),
	(204022, 'GASOLINA', 20402, 'N', 'S', 'N'),
	(204023, 'SERVICIO', 20402, 'N', 'N', 'S')

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre, detalle_gasto, fijo, variable, ocacional) values
	(20601, 'SUPER',		 206, 'S', 'N', 'S', 'N'),
	(20602, 'COMIDA AFUERA', 206, 'N', 'N', 'S', 'S')

	insert into metadata.clasificacion_gasto (clasificacion, valor, padre,  fijo, variable, ocacional) values
	(20701, 'DANIELA', 		207, 'S', 'N', 'N'), 
	(20702, 'CESAR', 		207, 'S', 'N', 'N'), 
	(20703, 'DOÑA TONY', 	207, 'S', 'N', 'N'), 
	(20704, 'NEGRA', 		207, 'S', 'N', 'N')

GO
	select	* 
	from	metadata.clasificacion_gasto
GO
/*FIN CREACION METADATA.CLASIFICACION_GASTO */


/* TABLAS PARA EL REGISTRO DE METADATA DE DETALLE DE GASTOS	
=================================================================
|Importante: Se eliminan primero las tablas hijas para evitar 
|errores de Foreign Keys (Llaves foráneas).
=================================================================
*/
use dp_presupuesto
go
	-- ELIMINACION DE TABLAS
	IF OBJECT_ID('metadata.detalle_gasto', 'U') IS NOT NULL
		DROP TABLE metadata.detalle_gasto
	GO

	IF OBJECT_ID('metadata.producto', 'U') IS NOT NULL
		DROP TABLE metadata.producto
	GO

	IF OBJECT_ID('metadata.dimension', 'U') IS NOT NULL
		DROP TABLE metadata.dimension
	GO

	-- CREACION DE TABLAS 
	create table metadata.producto(
		producto 		int				primary key,
		descripcion 	varchar(32)		not null,
		estado			smallint		not null default 1,
	)
	go

	create table metadata.dimension(
		dimension 		int				primary key,
		descripcion 	varchar(32) 	not null,
		estado			smallint		not null default 1,
	)
	go

	create table metadata.detalle_gasto(
		detalle_gasto 		int			not null,
		producto 			int 		not null,
		dimension			int 		not null,
		estado				smallint 	not null default 1,

		constraint PK_detalle_gasto primary key (detalle_gasto),
		constraint UQ_prodcuto_dimension UNIQUE (producto, dimension),
		constraint FK_detalle_gasto_producto FOREIGN KEY (producto)
			REFERENCES metadata.producto (producto),
		constraint FK_detalle_gasto_dimension FOREIGN KEY (dimension)
			REFERENCES metadata.dimension (dimension) 
	)
	go

	-- CREAR PARAMETRIZACION DE LAS TABLAS
	insert into metadata.producto (producto, descripcion, estado)
	values 	(1, 'HUEVOS', 	1),
			(2, 'LECHE', 	1)
	GO
	insert into metadata.dimension (dimension, descripcion)
	values 	(1, 'CAJA'),
			(2, 'CARTON'),
			(3, 'UNIDAD'),
			(4, 'LIBRA')
	GO
	insert INTO metadata.detalle_gasto (detalle_gasto, producto, dimension)
	values 	(1, 1, 1),
			(2, 1, 3),
			(3, 2, 1)
	GO
		select 	*
		from metadata.detalle_gasto dg
		inner join metadata.producto p on p.producto = dg.producto and p.estado = 1
		inner join metadata.dimension d on d.dimension = dg.dimension and d.estado = 1
		where dg.estado = 1
	GO