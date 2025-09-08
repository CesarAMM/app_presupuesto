export default class ContextGeneral {
    static async getcCatalogo(data) {
        if (data.status && data.data) {
            return { status: true, data: data.data.recordset };
        }
        return { status: false, data: null };
    }
}
