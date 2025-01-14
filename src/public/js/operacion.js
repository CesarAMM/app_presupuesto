/* eslint-disable no-undef */
// variables  Glovales
let VGCategoria, VGToperacion, VGSubCategoria, VGCuenta;
let VGContador

//! INICIO DE CARGA DE PAGINA
$(function() {
  $.ajax({
    url: '/operacion',
    timeout: 15000,
    method: 'GET',
    success: (data) => {
      VGToperacion = data.return[0];
      VGCategoria = data.return[1];
      VGSubCategoria = data.return[2];
      VGCuenta = data.return[3]
      $('#inp_monto').val(0)
      $('#inp_toperacion').html('<option value="0" selected>Tipo Operacion</option>')
      $(VGToperacion).each((i, e) => {
        $('#inp_toperacion').append(`<option value="${e.Codigo}">${e.Operacion}</option>`)
      })
      $('#inp_categoria').html('<option value="0" selected>Tipo Categoria</option>')
      $(VGCategoria).each((i, e) => {
        $('#inp_categoria').append(`<option value="${e.Codigo}">${e.Categoria}</option>`)
      })
      $('#inp_subcategoria').html('<option value="0" selected>Sub Tipo Categoria</option>')
      $(VGSubCategoria).each((i, e) => {
        $('#inp_subcategoria').append(`<option value="${e.Codigo}">${e.Descripcion}</option>`)
      })
      $('#inp_cuenta').html('<option value="0" selected>Sub Tipo Categoria</option>')
      $(VGCuenta).each((i, e) => {
        $('#inp_cuenta').append(`<option value="${e.Codigo}">${e.NoCuenta} - ${e.Banco}</option>`)
      })
    }
  })

  $.ajax({
    url: '/estado_cuenta',
    timeout: 15000,
    method: 'get',
    success: (data) => {
      if(data.estatus == true){
        const VLCuentas = data.data
        VLCuentas.forEach(VTElemento => {
          $('#tbL_det_cuentas').append(`
            <tr id="tbl_detalle_${VTElemento.CODIGO}">
              <td class="CSS_CODIGO">${VTElemento.CODIGO}</td>
              <td class="CSS_CUENTA">${VTElemento.CUENTA}</td>
              <td class="CSS_INGRESO">${PLImpMoneda(VTElemento.INGRESO)}</td>
              <td class="CSS_EGRESO">${PLImpMoneda(VTElemento.EGRESO)}</td>
              <td class="CSS_SALDO">${PLImpMoneda(VTElemento.SALDO)}</td>
            </tr>
          `);
        });

      }
    }
  })
});

$('#btnGuardarOperacion').on('click', () => {
  const VLTOperacion = parseInt($('#inp_toperacion').val())
  const VLCategoria = parseInt($('#inp_categoria').val())
  const VLSubcategoria = parseInt($('#inp_subcategoria').val())
  const VLCuenta = parseInt($('#inp_cuenta').val())
  const VLMonto = parseFloat($('#inp_monto').val())
  const VLFecha = $('#inp_fecha_compra').val()
  const VLModo = parseInt($('#btnShowDetalle').val())

  if(VLTOperacion == 0 || VLCategoria == 0 || VLSubcategoria == 0 || VLCuenta == 0 || VLMonto == 0){
    alert('Debe de llenar todas las opciones')
    return;
  }

  if(VLFecha == ""){
    alert('Debe de seleccionar la fecha')
    return;
  }

  $.ajax({
    url: '/insert_operacion',
    timeout: 15000,
    method: 'post',
    data:{
      VLTOperacion: VLTOperacion, 
      VLCategoria: VLCategoria,
      VLSubcategoria: VLSubcategoria,
      VLCuenta: VLCuenta, 
      VLMonto: VLMonto, 
      VLFecha: VLFecha
    },
    success: (data) => {
      const VLEstado = data.VLRespuesta.estatus
      const VLOperacion = data.VLRespuesta.codigo
      let VLContador = 0
      if(VLEstado == false){ return }

      if(VLModo == 1 && VLOperacion != 0){
        $('#tbL_det_operacion > tr').each((i, e) => {
          $.ajax({
            url: '/insert_det_operacion',
            timeout: 15000,
            method: 'POST',
            data: {
              VTOperacion: VLOperacion,
              VTCodigo: parseInt($(e).find('.CSS_CONTADOR').html()),
              VTDescripcion: $(e).find('.CSS_DESCRIPCION').html(),
              VTMedida: $(e).find('.CSS_MEDIDA').html(),
              VTCantidad: parseInt($(e).find('.CSS_CANTIDAD').html()),
              VTMonto: parseFloat($(e).find('.VLMONTO').html())
            },
            success: (data2) => { if(data2.estatus){VLContador++} }
          })
        })
      }
      PLLimpiar()
    }
  })

})

$('#inp_toperacion, #inp_categoria').on('change', () => {
  const VLToperacion = $("#inp_toperacion").val()
  const VLCategoria = $('#inp_categoria').val()
  const VLPT1 = VLToperacion == 1 ? "sci" : VLToperacion == 2 ? "sce" : ""
  const VLPT2 = VLCategoria == 1 ? "fijo" : VLCategoria == 2 ? "variable" : VLCategoria == 3 ? "ocacional" : VLCategoria == 4 ? "inversion" : ""
  $('#inp_subcategoria').html(`<option value="0" selected>Sub Tipo Categoria</option>`)
  if(VLPT1 == "" && VLPT2 == ""){
    $(VGSubCategoria).each((i, e) => {
      $('#inp_subcategoria').append(`<option value="${e.Codigo}">${e.Descripcion}</option>`)
    })
  }else{
    $(VGSubCategoria).each((i, e) => {
      const VLBusqueda1 = e.Tabla.split("_")[1], VLBusqueda2 = e.Tabla.split("_")[2]
      if((VLBusqueda1 == VLPT1 || VLPT1 == "") && (VLBusqueda2 == VLPT2 || VLPT2 == "")){
        $('#inp_subcategoria').append(`<option value="${e.Codigo}">${e.Descripcion}</option>`)
      }
    })
  }
})

$('#btnShowDetalle').on('click', () => {
  const VLValor = $('#btnShowDetalle').val()
  $('#btnShowDetalle').html(VLValor == 0 ? 'Cancelar Detalle' : 'Agregar Detalle')
  $('#btnShowDetalle').removeClass().addClass(VLValor == 0 ? 'btn btn-outline-danger': 'btn btn-outline-primary')
  $('#inp_monto').attr('disabled', VLValor == 0)
  $('#inp_monto').val(0)
  VGContador = 0
  $('#btnShowDetalle').val(VLValor == 0 ? 1: 0)
  $('#tbL_det_operacion').html('')
})

$('#btn_agregar').on('click', () => {
  const VLDescripcion = $('#inp_detalle').val()
  const VLMonto = $('#inp_det_monto').val()
  const VLCantidad = $('#inp_cantidad').val()
  const VLMedida = $('#inp_medida').val()

  if(VLDescripcion == "" || VLMonto == "" || VLCantidad == "" || VLMedida == ""){
    alert("Los campos son Obligatorios")
    return;
  }
  if(VLMonto == 0 || VLMonto == "0"){
    alert("El monto no puede ser cero");
    return;
  }
  if(VLCantidad == 0 || VLCantidad == "0"){
    alert("El monto no puede ser cero");
    return;
  }

  VGContador++
  $('#tbL_det_operacion').append(`
    <tr id="tbl_detalle_${VGContador}">
      <td class="CSS_CONTADOR">${VGContador}</td>
      <td class="CSS_DESCRIPCION">${VLDescripcion}</td>
      <td class="CSS_MEDIDA">${VLMedida}</td>
      <td class="CSS_CANTIDAD">${VLCantidad}</td>
      <td class="CSS_MONTO">${PLImpMoneda(VLMonto)}</td>
    </tr>
  `)
  $('#inp_monto').val(PLMontoDetalle())
  //! Limpiar los campos
  $('#inp_det_monto').val('')
  $('#inp_cantidad').val('')
  $('#inp_detalle').val('')
  $('#inp_medida').val('')
})

function PLMontoDetalle() {
  let VLMonto = 0
  $('#tbL_det_operacion > tr').each((i,e) => {
    VLMonto += Math.round(parseFloat($(e).find('.VLMONTO').html()) * 100) /100
  })
  return VLMonto
}

function PLLimpiar(){
  $('#inp_toperacion').val(0)
  $('#inp_categoria').val(0)
  $('#inp_subcategoria').val(0)
  $('#inp_cuenta').val(0)
  $('#inp_monto').val('0')
  $('#inp_fecha_compra').val('')
  $('#inp_det_monto').val('')
  $('#inp_cantidad').val('')
  $('#inp_detalle').val('')
  $('#inp_medida').val('')
  const VLValor = $('#btnShowDetalle').val()
  if(VLValor != 0){
    $('#btnShowDetalle').html(VLValor == 0 ? 'Cancelar Detalle' : 'Agregar Detalle')
    $('#btnShowDetalle').removeClass().addClass(VLValor == 0 ? 'btn btn-outline-danger': 'btn btn-outline-primary')
    $('#inp_monto').attr('disabled', VLValor == 0)
    $('#inp_monto').val(0)
    VGContador = 0
    $('#btnShowDetalle').val(VLValor == 0 ? 1: 0)
    $('#tbL_det_operacion').html('')
    $('#seccion_detalle').removeClass('show')
  }
}

function PLImpMoneda(VTValor){
  let VLValor = VTValor.toString().split('.')[0]
  let VLDecimal = VTValor.toString().split('.')[1]
  let VLHTML = '', VLContador = 0
  const VLLongitud = VLValor.length
  for(let i = VLLongitud; i > 0; i--){
    VLContador++
    VLHTML += VLValor.substring(i, i-1)
    if(VLContador%3 == 0 && i -1 > 0){VLHTML += ','}
  }
  const VLAuxHTML = VLHTML;
  VLHTML = '';
  for(let  i = VLAuxHTML.length; i > 0; i--){
    VLHTML += VLAuxHTML.substring(i, i-1)
  }
  if(VLDecimal === undefined){VLDecimal = '00'}
  if(VLDecimal.length < 2){ VLDecimal = VLDecimal + '0'}
  return `Q <spam class="VLMONTO">${VLHTML}.${VLDecimal}</spam>`
}