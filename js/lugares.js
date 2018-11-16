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
          radius: 20000
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

    //Guardar en un objeto los parametros de NerbySearch (posición, tipoDeLugar, radio)
    let parametrosNerbySearch = {
      location: posicion,
      type: [document.getElementById('tipoDeLugar').value], 
      radius: document.getElementById('radio').value
    }
    console.log(parametrosNerbySearch.type)
    console.log(parametrosNerbySearch.radius)

    //Consultar el metodo de la API de Google nerbySearch(location, radius, types) con su respectiva función callBack en caso de que el status de consulta sea OK
    servicioLugares.nearbySearch({
      'location': parametrosNerbySearch.location,
      'radius': parametrosNerbySearch.radius,
      'types': parametrosNerbySearch.type
    }, (response, status)=>marcadorModulo.marcarLugares(response,status))

  }
  return {
    inicializar,
    buscarCerca
  }
})()
