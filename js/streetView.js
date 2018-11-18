streetViewModulo = (function () {
  let paronama // 'Visor' de StreetView

  function inicializar () {
        /* Completar la función inicializar()  que crea un panorama
        en una posición y lo muestra en la página. */

        panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
        position: '',
        pov: {
          heading: '',
          pitch: ''
        }, 
        visible:true 
        });
        
        
  }

    // Actualiza la ubicación del Panorama
  function fijarStreetView (ubicacion) {

        /* Completar la función fijarStreetView que actualiza la posición
         de la variable panorama y cambia el mapa de modo tal que se vea
         el streetView de la posición actual. */

         panorama.setPosition(ubicacion)
         panorama.setPov({
          heading: 45,
          pitch: -10
         })

  }

  return {
    inicializar,
    fijarStreetView
  }
})()
