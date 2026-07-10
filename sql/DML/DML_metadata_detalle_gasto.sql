
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