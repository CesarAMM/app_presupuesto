/* eslint-disable no-undef */
// variables  Glovales
let VGCategoria, VGToperacion, VGSubCategoria;
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
    }
  })
});

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
        console.log('-------------------------')
        console.log(`${VLPT1} == ${VLBusqueda1}`)
        console.log(`${VLPT2} == ${VLBusqueda2}`)
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
      <td class="CSS_MONTO">${VLMonto}</td>
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
    VLMonto += parseFloat($(e).find('.CSS_MONTO').html())
  })
  return VLMonto
}
