const persona = new Object({
    id: Int16Array,
    descripcion: String
})

export default class ContextPresupuesto {
    static DataPresupuesto (data: any){
        console.log(data)
        console.log(persona)
    }
}