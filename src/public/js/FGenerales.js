const VGGET = 'GET', VGPOST = 'POST'

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

function FGLlenarSelect(IdElement, args, descripcion){
  console.log(args)
  $('#'+IdElement).html('<option value="0" selected>'+descripcion+'</option>')
  $(args).each((i, e) => {
    $('#'+IdElement).append(`<option value="${e.CODIGO}">${e.VALOR}</option>`)
  })
}

function FGCatalogo(IdElement, tabla){
  $.ajax({
    url: '/catalogo', timeout: 15000, method: 'POST', data: {tabla: tabla},
    success: (respuesta) => {
      console.log(respuesta)
      if(respuesta.status){
        FGLlenarSelect(IdElement, respuesta.data, 'Seleccione una opción')
      }
    }
  })
}