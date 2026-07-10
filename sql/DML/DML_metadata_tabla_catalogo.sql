use dp_presupuesto
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