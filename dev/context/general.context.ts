import { IProcedureResult } from "mssql";

interface ResponseData{
    status: boolean,
    data: IProcedureResult<any> | null
}

export default class ContextGeneral {
    static async getcCatalogo (data: ResponseData)  {
        if (data.status && data.data) {
            return {status: true, data: data.data.recordset};
        }
        return {status: false, data: null};
    }
}