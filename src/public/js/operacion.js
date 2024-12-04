/* eslint-disable no-undef */
// variables  Glovales
let VGcategoria, VGToperacion, VGSubCategoria;
let VGContador
$(function() {
  $.ajax({
    url: '/operacion',
    timeout: 15000,
    method: 'GET',
    success: (data) => {
      VGToperacion = data.return[0];
      VGcategoria = data.return[1];
      VGSubCategoria = data.return[2]
      console.log(VGcategoria)
      console.log(VGToperacion)
      console.log(VGSubCategoria)
    }
  })
});

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
