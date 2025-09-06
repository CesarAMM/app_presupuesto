/* eslint-disable no-undef */
// variables  Glovales
let VGTOPERACION, VGCATEGORIA, VGSUBCATEGORIA, VGTCATEGORIA, VGMATRIZ = [];
let VGCUENTA
let VGContador

//! INICIO DE CARGA DE PAGINA
$(()=> {
  $.ajax({
    url: '/operacion',
    timeout: 15000,
    method: 'GET',
    success: (respuesta) => {
      VGMATRIZ = respuesta.MATRIZ;
      VGTOPERACION = respuesta.TOPERACION;
      VGCATEGORIA = respuesta.CATEGORIA;
      VGSUBCATEGORIA = respuesta.SUBCATEGORIA;
      VGTCATEGORIA = respuesta.TCATEGORIA;
      VGCUENTA = respuesta.CUENTA;
      $('#inp_monto').val(0)
      FGLlenarSelect('inp_toperacion', VGTOPERACION, 'TIPO DE OPERACION')
      FGLlenarSelect('inp_categoria', VGCATEGORIA, 'CATEGORIA')
      FGLlenarSelect('inp_tcategoria', VGTCATEGORIA, 'TIPO DE CATEGORIA')
      FGLlenarSelect('inp_subcategoria', VGSUBCATEGORIA, 'TIPO DE SUBCATEGORIA')
      FGLlenarSelect('inp_cuenta', VGCUENTA, 'SELECCIONE CUENTA')
    }
  })
  FNConsultaEstado();
});

const FNConsultaEstado = () => {
  $.ajax({
    url: '/estado_cuenta',
    timeout: 15000,
    method: 'get',
    success: (data) => {
      if(data.estatus == true){
        const VLCuentas = data.DATA
        $('#tbL_det_cuentas').html('')
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
}

$('#btnGuardarOperacion').on('click', () => {
  const VLTOperacion = $('#inp_toperacion').val(),
        VLCategoria = $('#inp_categoria').val(),
        VLTCategoria = $('#inp_tcategoria').val(),
        VLSubcategoria = $('#inp_subcategoria').val(),
        VLCuenta = $('#inp_cuenta').val(),
        VLMonto = parseFloat($('#inp_monto').val()),
        VLFecha = $('#inp_fecha_compra').val(),
        VLModo = parseInt($('#btnShowDetalle').val()),
        VLResponsable = $('#inp_responsable').val()
  if( VLTOperacion == '0' || VLCategoria == '0' || VLTCategoria == '0' || 
    VLSubcategoria == '0' || VLCuenta == '0' || VLMonto == 0 || VLResponsable == ""){
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
    data:{  VLTOperacion: VLTOperacion, 
            VLCategoria: VLCategoria,
            VLSubcategoria: VLSubcategoria,
            VLTCategoria: VLTCategoria,
            VLCuenta: VLCuenta, 
            VLMonto: VLMonto, 
            VLFecha: VLFecha,
            VLResponsable: VLResponsable
    },
    success: (data) => {
      const VLEstado = data.VLRespuesta.estatus
      const VLOperacion = data.VLRespuesta.codigo
      let VLContador = 0
      if(VLEstado == false) return 
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
            success: (data2) => {if(data2.estatus){VLContador++}}
          })
        })
      }
      FNConsultaEstado();
      PLLimpiar()
    }
  })
})

$('#inp_toperacion, #inp_categoria, #inp_tcategoria').on('change', () => {
  const VLTOPERACION = $("#inp_toperacion").val()
  const VLCATEGORIA = $('#inp_categoria').val()
  const VLTCATEGORIA = $('#inp_tcategoria').val()

  $('#inp_categoria > option').each((index, element) => {$(element).hide()})
  $('#inp_tcategoria > option').each((index, element) => {$(element).hide()})
  $('#inp_subcategoria > option').each((index, element) => {$(element).hide()})

  VGMATRIZ.forEach((element, index) => {
    if(element.cod_toperacion == VLTOPERACION){ $(`#inp_categoria option[value="${element.cod_categoria}"]`).show() }

    if((element.cod_toperacion == VLTOPERACION && element.cod_categoria == VLCATEGORIA) || VLTOPERACION == 0){ $(`#inp_tcategoria option[value="${element.cod_tcategoria}"]`).show() }

    if((element.cod_toperacion === VLTOPERACION && element.cod_categoria === VLCATEGORIA && element.cod_tcategoria === VLTCATEGORIA) || (parseInt(VLTOPERACION) == 0 && parseInt(VLCATEGORIA) == 0)){ $(`#inp_subcategoria option[value="${element.cod_subcategoria}"]`).show() }
  })
})

$('#btnShowDetalle').on('click', () => {
  const VLValor = $('#btnShowDetalle').val()
  $('#btnShowDetalle').html(VLValor == 0 ? 'Cancelar Detalle' : 'Agregar Detalle')
  $('#btnShowDetalle').removeClass().addClass(VLValor == 0 ? 'btn btn-outline-danger': 'btn btn-outline-primary')
  //$('#inp_monto').attr('disabled', VLValor == 0)
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
  $('#tbL_det_operacion > tr').each((i,e) => { VLMonto += parseFloat($(e).find('.VLMONTO').html().replace(/,/g, '')) })
  return Number(VLMonto.toFixed(2))
}

function PLLimpiar(){
  const VLValor = $('#btnShowDetalle').val()
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
  $('#inp_responsable').val('')
  $('#inp_tcategoria').val(0)
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

$('#btnLimpiar').on('click', () =>{PLLimpiar()})