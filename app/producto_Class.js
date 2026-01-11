class producto extends entidad {
  constructor(esTest) {
    super(esTest)

    //definicion de atributos a mostrar en la tabla de muestra de tuplas al entrar en la gestion de la entidad
    this.columnasamostrar = [0];
    //definicion de atributos a cambiar su visualización
    this.mostrarespecial = [];

    this.atributos = Object.keys(window.estructura_producto.attributes)
  }
}

window.producto = producto
