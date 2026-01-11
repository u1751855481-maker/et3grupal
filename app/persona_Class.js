class persona extends entidad {
  constructor(esTest) {
    super(esTest);

    //definicion de atributos a mostrar en la tabla de muestra de tuplas al entrar en la gestion de la entidad
    this.columnasamostrar = [0, 1, 2];
    //definicion de atributos a cambiar su visualización
    this.mostrarespecial = [7, 8];

    // definicion de los atributos del formulario
    this.atributos = Object.keys(window.estructura_persona.attributes)
  }
}

window.persona = persona;
