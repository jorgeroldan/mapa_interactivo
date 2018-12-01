marcadorModulo = (function () {
  let miMarcador // El marcador de la direccion buscada
  let marcadores = [] // Todos los marcadores de la búsqueda
  let marcadoresRuta = [] // Los marcadores de la ruta
  let limites // Límites del mapa
  let infoVentana // La ventana con información

    // Crea un marcador y lo muestra en el mapa
  function mostrarMiMarcador (ubicacion) {
        /* Completar la función mostrarMiMarcador() para crear un marcador
        en la posición pasada por parámetro y mostrarlo en el mapa.
        Este marcador debe tener un título, una animación.
        El marcador que vas a crear debe asignarse a la variable miMarcador */
        miMarcador = new google.maps.Marker({
          position: ubicacion, 
          map: mapa,
          title: document.getElementById('direccion').value,
          animation: google.maps.Animation.DROP
        });
  }

    // Agrega la dirección del marcador en la lista de Lugares Intermedios
  function agregarDireccionMarcador (marcador) {
        // console.log(marcador.getPosition().lat() + ',' + marcador.getPosition().lng());
    let marcadorLatLng = new google.maps.LatLng({ lat: marcador.getPosition().lat(), lng: marcador.getPosition().lng() })
    direccionesModulo.agregarDireccion(marcador.getTitle(), marcadorLatLng)
  }

    // Agrega al mapa todos los marcadores.
  function marcadoresEnMapa (marcadores, mapa) {
    for (let i = 0; i < marcadores.length; i++) {
      marcadores[i].setMap(mapa)
    }
  }

    // Muestra todos los marcadores. Por ahora no la uso
  function mostrarMarcadores (marcadores) {
    marcadoresEnMapa(marcadores, mapa)
  }

    // Saca los marcadores del mapa, pero siguen en el Array marcadores.
  function noMostrarMarcadores (marcadores) {
    marcadoresEnMapa(marcadores, null)
  }

    // Borra todos los marcadores del mapa y del array.
  function borrarMarcadores (marcadores) {
    noMostrarMarcadores(marcadores)
    marcadores = []
  }

    // Borra todos los marcadores del mapa y del array.
  function borrarMarcadoresRuta (marcadores) {
    borrarMarcadores(marcadoresRuta)
  }

    // Borra todos los marcadores del mapa y del array.
  function borrarMarcadoresLugares (marcadores) {
    borrarMarcadores(marcadoresLugares)
  }
    // Cuando cambia el elemento "tipoDeLugar" marco todos lugares cerca
    // del lugar indicado por MiMarcador
  let tipoDeLugar = document.getElementById('tipoDeLugar')
  tipoDeLugar.addEventListener('change', function () {
    if (tipoDeLugar.value != '') {
      marcadorModulo.marcar()
    }
  })

    // Cuando cambia el elemento "radio" marco todos lugares cerca
    // del lugar indicado por MiMarcador con el nuevo radio

  let rango = document.getElementById('radio')
  rango.addEventListener('change', function () {
    marcadorModulo.marcar()
  })

  rango.addEventListener('input', function () {
    mostrarValor(rango.value)
  })

    // Crea marcador que al hacer click muestra la información del lugar.
  crearMarcador = function (lugar) {
    let icono = {
      url: lugar.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    }

    let marcador = new google.maps.Marker({
      map: mapa,
      position: lugar.geometry.location,
      title: lugar.name + '\n' + lugar.vicinity,
      icon: icono
    })
    marcadores.push(marcador)

    google.maps.event.addListener(marcador, 'dblclick', function () {
      agregarDireccionMarcador(marcador)
    })

    google.maps.event.addListener(marcador, 'rightclick', function () {
      let indice
      for (let i = 0; i < marcadores.length; i++) {
        if (marcadores[i] == marcador) {
          marcadores[i].setMap(null)
          indice = i
          marcadores.splice(indice, 1)
        }
      }
    })

        // Cuando haces clic sobre el marcador, muestra la foto,
        // el nombre y la valuación del lugar si es que lo tienen.
    let lugarLoc = lugar.geometry.location
    google.maps.event.addListener(marcador, 'click', function () {
      streetViewModulo.fijarStreetView(lugarLoc)
      let valuacion = 'No tiene'
      if (lugar.rating) {
        valuacion = lugar.rating.toString()
      }

            // agrega información del lugar en la ventana del marcador
      if (lugar.photos) {
        let url = lugar.photos[0].getUrl({
          'maxWidth': 80,
          'maxHeight': 80
        })
      }
      let nombre = lugar.name
      let nombreLugar = lugar.vecinity
      if (url) {
        if (nombreLugar) {
          infoVentana.setContent('<h3>' + nombre + '</h3>' + '<img src=' + url + '>' + '<p> Rating: ' + valuacion + '</p>' + '<p> Direccion: ' + nombreLugar + '</p>')
        } else {
          infoVentana.setContent('<h3>' + nombre + '</h3>' + '<img src=' + url + '>' + '<p> Rating: ' + valuacion + '</p>')
        }
      } else {
        infoVentana.setContent('<h3>' + nombre + '</h3>')
      }

      infoVentana.open(mapa, this)
    })
  }

    // Extiende los limites a partir del lugar que se agrega
  function extenderLimites (lugar) {
    if (lugar.geometry.viewport) {
      limites.union(lugar.geometry.viewport)
    } else {
      limites.extend(lugar.geometry.location)
    }
    mapa.fitBounds(limites)
  }

    // Creo un objeto InfoWindow que será la ventana donde se mostrará la información
    // Cre la variable limites que contiene los límites del mapa
    // Llamo a la funcion agregarMarcadoresClicCargarDirecciones() para que marque a los lugares
    // cuando se hace clic en AgregarDirecciones
  function inicializar () {
        // Muestra marcador cuando se presioná enteren el campo direccion
    $('#direccion').keypress(function (e) {
      if (e.keyCode == 13) {
        marcadorModulo.mostrarMiMarcador()
      }
    })
    infoVentana = new google.maps.InfoWindow()
    limites = new google.maps.LatLngBounds()
  }

    // Función que devuelve true si ya se declaro la variable miMarcador
  function existeMiMarcador () {
    return miMarcador != undefined
  }

    // Devuelve la posicion de la variable miMarcador
  function damePosicion () {
    return miMarcador.getPosition()
  }

    // Agrego el marcador con la ruta. Le asigna las letras correspondientes al marcador.
    // Al hacer click en el marcador se fija el StreetView en la posición de este.
  function agregarMarcadorRuta (direccion, letra, esInicial) {
    borrarMarcadores(marcadoresRuta)

    let zIndice = 1
    if (esInicial) {
      zIndice = 2
    }

    function agregarMarcadorConStreetView (direccion, ubicacion) {
      let marcador = new google.maps.Marker({
        map: mapa,
        position: ubicacion,
        label: letra,
        animation: google.maps.Animation.DROP,
        draggable: false,
        zIndex: zIndice

      })
      limites.extend(ubicacion)
      google.maps.event.addListener(marcador, 'click', function () {
        streetViewModulo.fijarStreetView(marcador.position)
      })

      marcadoresRuta.push(marcador)
    }
    geocodificadorModulo.usaDireccion(direccion, agregarMarcadorConStreetView)
    mapa.fitBounds(limites)
  }

    // Marca los lugares que están en el arreglo resultados y
    // extiende los límites del mapa teniendo en cuenta los nuevos lugares
  function marcarLugares (resultados, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < resultados.length; i++) {
        crearMarcador(resultados[i])
        extenderLimites(resultados[i])
      }
    }
  }

    // Marco los lugares cerca de mi posición
  function marcar () {
    borrarMarcadores(marcadores)
    console.log('lugar: ' + document.getElementById('tipoDeLugar').value)
    let miPosicion
    if (marcadorModulo.existeMiMarcador()) {
      miPosicion = marcadorModulo.damePosicion()
    } else {
      miPosicion = posicionCentral
    }
    lugaresModulo.buscarCerca(miPosicion)
        // cambio el centro del mapa a miPosicion
    mapa.panTo(miPosicion)
  }

  return {
    inicializar,
    existeMiMarcador,
    damePosicion,
    mostrarMiMarcador,
    agregarMarcadorRuta,
    borrarMarcadores,
    marcarLugares,
    marcar
  }
})()
