use dp_presupuesto
go

-- create schema metadata
go
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


-- DML: ESTADOS
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

select * 
from metadata.tabla t
inner join metadata.catalogo c on t.codigo = c.tabla

GO

if OBJECT_ID('metadata.clasificacion_gasto') is not null
	drop table metadata.clasificacion_gasto

create table metadata.clasificacion_gasto(
	clasificacion	varchar(10)		primary key,
	valor			varchar(32)		not null,
	padre			varchar(10)		null,
	estado			smallint		not null default 1,

	constraint FK_clasificacion_padre FOREIGN KEY (padre)
		references metadata.clasificacion_gasto(clasificacion)
)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
(1, 'INGRESO', null),
(2, 'EGRESO', NULL)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
(110, 'SALARIO', 1),
(120, 'DIFERIDO', 1),
(130, 'AGUINALDO', 1),
(140, 'BONO 14', 1),
(150, 'BONO', 1)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
(11001, 'CESAR', 110),
(11002, 'DANIELA', 110),
(12001, 'CESAR', 120),
(12002, 'DANIELA', 120),
(13001, 'CESAR', 130),
(13002, 'DANIELA', 130),
(14001, 'CESAR', 140),
(14002, 'DANIELA', 140)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
(210, 'SERVICIO', 2),
(220, 'DEUDA', 2),
(230, 'AHORRO', 2),
(240, 'VEHICULO', 2),
(250, 'BANCO', 2),
(260, 'COMPRA', 2),
(270, 'MESADA', 2)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
(21001, 'MANTENIMIENTO', 210), (21002, 'CLARO CELULAR', 210), (21003, 'CLARO HOGAR', 210), (21004, 'LUZ', 210), (21005, 'STREAMING', 210)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values 
(22001, 'HIPOTECA', 220), (22002, 'VISACUOTAS', 220), (22003, 'EXTRAFINANCIAMIENTO', 220), (22004, 'CREDITO', 220)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values
(23001, 'COPE BANRURAL', 230), (23002, 'FONDO RETIRO', 230)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values
(24001, 'MOTO', 240), (24002, 'CARRO', 240)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values
(240011, 'GASOLINA', 24001), (240012, 'SERVICIO', 24001), (240022, 'GASOLINA', 24002), (240023, 'SERVICIO', 24002)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values
(26001, 'SUPER', 260),
(26002, 'COMIDA AFUERA', 260)

insert into metadata.clasificacion_gasto (clasificacion, valor, padre) values
(27001, 'DANIELA', 270), (27002, 'CESAR', 270), (27003, 'DOÑA TONY', 270), (27004, 'NEGRA', 270)
GO
	select	* 
	from	metadata.clasificacion_gasto
GO