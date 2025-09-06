export default class ContextPresupuesto {
    static getPresupuesto(data) {
        return data.map((row) => ({
            id: row.ID
        }));
    }
}
