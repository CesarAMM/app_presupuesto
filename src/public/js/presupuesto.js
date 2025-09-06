$(()=> {
    $.ajax({
        url: '/optener_datos_presupuesto',
        timeout: 15000,
        method: 'get',
        success: (respuesta) => {
            console.log(respuesta)
        }
    })
})

