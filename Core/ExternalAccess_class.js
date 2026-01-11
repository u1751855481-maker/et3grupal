class ExternalAccess {
  constructor() {}

  async peticionBackGeneral(
    formulario,
    controlador,
    action,
    datosextra = null,
  ) {
    var datos;

    // caso de primera carga de SEARCH no depender del formulario manual
    // se hace sin ningun filtro

    if (formulario === "" || document.getElementById(formulario) == null) {
      datos = new FormData();
    } else {
      var formulario = document.getElementById(formulario);
      datos = new FormData(formulario);
    }

    datos.append("controlador", controlador);
    datos.append("action", action);

    if (datosextra == null) {
      console.log(datosextra);
    } else {
      console.log(
        "ExternalAccess::peticionBackGeneral: Datos extra no es null",
      );
      for (var clave in datosextra) {
        datos.append(clave, datosextra[clave]);
      }
    }

    console.log("ExternalAccess::PeticionBackGeneral", controlador);

    return fetch("http://193.147.87.202/ET2/index.php", {
      method: "POST",
      body: datos,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        throw error;
      });
  }
}
