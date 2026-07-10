use dp_presupuesto
go
if OBJECT_ID('sp_metadata_operaciones') is not null 
BEGIN
    DROP PROC sp_metadata_operaciones
    if OBJECT_ID('sp_metadata_operaciones') is null
        PRINT '<< SUCCESS DROP PROCEDURE sp_metadata_operaciones >>'
    else
        PRINT '<< WARNING DROP PROCEDURE sp_metadata_operaciones >>'     
END
GO
create procedure sp_metadata_operaciones(
    @i_operacion char(1)
)
As
begin
    if @i_operacion != 'Q'
    begin
        
        return 21000
    end

    if @i_operacion = 'Q'
    begin
        select  * from    metadata.clasificacion_gasto
        where   estado = 1
        order   by clasificacion asc

        select	codigo, cuenta + ' - ' + tipo "dedscripcion" 
        from	core.cuenta
        where	estado = 1

        select	c.codigo, c.valor from	metadata.tabla t
        inner join metadata.catalogo c on t.codigo = c.tabla
        where t.tabla = 'tbl_tipo_transaccion'

        select 	* from metadata.producto
        where estado = 1

        select 	* from metadata.dimension
        where estado = 1

        select 	* from metadata.detalle_gasto
        where estado = 1
        
        return 0
    end
end
go
IF OBJECT_ID('sp_metadata_operaciones') IS NULL
    PRINT '<< ERROR CREATE PROCEDURE sp_metadata_operaciones >>'
ELSE
    PRINT '<< SUCCESS CREATE PROCEDURE sp_metadata_operaciones >>'
GO
