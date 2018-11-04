lugaresModulo = (function () {
  let servicioLugares // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

    // Completa las direcciones ingresadas por el usuario a y establece los límites
    // con un círculo cuyo radio es de 20000 metros.
  function autocompletar () {
        /* Completar la función autocompletar(): autocompleta los 4 campos de texto de la
        página (las direcciones ingresables por el usuario).
        Para esto creá un círculo con radio de 20000 metros y usalo para fijar
        los límites de la búsqueda de dirección. El círculo no se debe ver en el mapa. */

        let direccion;
        let circulo = new google.maps.Circle({
          center: posicionCentral,
          radius: 200000
        })

        let inputDireccion = document.getElementById("direccion"),
            inputDesde = document.getElementById("desde"),
            inputHasta = document.getElementById("hasta"),
            inputAgregar = document.getElementById("agregar")

        let options = {
          bounds: circulo.getBounds(),
          types: ['geocode'],
          strictBounds: true
        }

        let autoCompletarDireccion = new google.maps.places.Autocomplete(inputDireccion, options),
            autocompletarDesde = new google.maps.places.Autocomplete(inputDesde, options),
            autocompletarHasta = new google.maps.places.Autocomplete(inputHasta, options),
            autocompletarAgregar = new google.maps.places.Autocomplete(inputAgregar, options);

        autoCompletarDireccion.addListener('place_changed', () => {
          direccion = document.getElementById('direccion').value;
          geocodificadorModulo.usaDireccion(direccion, direccionesModulo.agregarDireccionYMostrarEnMapa);
        });
  }

    // Inicializo la variable servicioLugares y llamo a la función autocompletar
  function inicializar () {
    servicioLugares = new google.maps.places.PlacesService(mapa)
    autocompletar()
  }

    // Busca lugares con el tipo especificado en el campo de TipoDeLugar

  function buscarCerca (posicion) {
        /* Completar la función buscarCerca  que realice la búsqueda de los lugares
    del tipo (tipodeLugar) y con el radio indicados en el HTML cerca del lugar
    pasado como parámetro y llame a la función marcarLugares. */

    let tipoDeLugar = document.getElementById('tipoDeLugar').value 
    let radio = document.getElementById('radio').value
    console.log(tipoDeLugar)
    console.log(radio)

    servicioLugares.nearbySearch({
      'location': posicion,
      'radius': radio,
      'types': tipoDeLugar
    }, (response, status)=>marcadorModulo.marcarLugares(response,status))


  }
  return {
    inicializar,
    buscarCerca
  }
})()
