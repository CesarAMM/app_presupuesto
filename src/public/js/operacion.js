/* eslint-disable no-undef */

$(function() {
  $.ajax({
    url: '/operacion',
    timeout: 15000,
    method: 'GET',
    success: (data) => {
      console.log(data)
    }
  })

});