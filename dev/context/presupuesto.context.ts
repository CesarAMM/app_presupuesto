
interface presupuesto {
    id: number
}
export default class ContextPresupuesto {
    static getPresupuesto (data: any): presupuesto[] {
        return data.map((row: any) => ({
            id: row.ID
        })) 
    }
}