class entidad extends EntidadAbstracta {
  constructor(esTest) {
    super(esTest);

    //definicion de atributos a mostrar en la tabla de muestra de tuplas al entrar en la gestion de la entidad
    this.columnasamostrar = [0, 1, 2];
    //definicion de atributos a cambiar su visualización
    this.mostrarespecial = [7, 8];

    // definicion de los atributos del formulario (Necesario para test de unidad)
    this.atributos = [
      "atributo_uno",
      "atributo_dos",
      "atributo_tres",
      "atributo_cuatro",
      "atributo_cinco",
      "atributo_seis",
      "atributo_siete",
      "atributo_ocho",
      "atributo_nueve",
    ];

    if (!esTest) {
      console.log("No es test")
      this.SEARCH();
    }

    // TODO: añadir getStructure() en la fase de entidades de ejemplo (Fase 5) para exponer la estructura ET3.
  }

  getStructure() {
    return typeof estructura_persona !== "undefined"
      ? estructura_persona
      : null;
  }

  hasSpecializedTest(attributeName) {
    const methodName = `specialized_test_${attributeName}`;
    return typeof this[methodName] === "function";
  }

  runSpecializedTest(attributeName, action, value) {
    const methodName = `specialized_test_${attributeName}`;
    if (typeof this[methodName] !== "function") {
      return true;
    }
    return this[methodName](action, value);
  }

  specialized_test_dni(action, valor) {
    return this.personalize_dni_nie(valor, { showDomErrors: false });
  }

  /**
   * replace the content of section element with a particular entity menu
   * @returns
   */
  manual_form_creation() {
    const container = document.createElement("div");
    const structure =
      this.getStructure?.() || window["estructura_persona"] || {};
    const builder = this.getFormRenderer();
    builder.createForm(
      container,
      structure,
      "ADD",
      {},
      {
        formId: "form_iu",
        formClasses: ["formulario"],
        showActions: false,
        useEntityPrefix: false,
      },
    );
    return container.innerHTML;
  }

  getFormRenderer() {
    return (
      window.uiManager?.formRenderer ||
      new DOMFormTableBuilder({
        languageManager: window.generalUIManager?.languageManager,
      })
    );
  }

  getFormOptionsForAction(action, structure = {}) {
    const options = {
      formId: "form_iu",
      formClasses: ["formulario"],
      useEntityPrefix: false,
      formAttributes: {
        enctype: "multipart/form-data",
        method: "post",
      },
    };

    if (typeof this[action] === "function") {
      options.formAttributes.action = `javascript:entidad.${action}();`;
    }

    if (action === "ADD") {
      options.hiddenAttributes = ["foto_persona"];
    }

    if (action === "EDIT") {
      options.readonlyAttributes = ["dni", "foto_persona"];
    }

    if (action === "DELETE") {
      const attributeNames = Object.keys(structure.attributes || {});
      options.readonlyAttributes = attributeNames;
    }

    if (action === "SHOWCURRENT") {
      const attributeNames = Object.keys(structure.attributes || {});
      options.readonlyAttributes = attributeNames;
      options.disabledAttributes = attributeNames;
      options.showActions = false;
    }

    return options;
  }

  renderActionForm(action, tupleData = {}) {
    const container = document.getElementById("contenedor_IU_form");
    if (!container) return null;

    const structure =
      this.getStructure?.() || window["estructura_persona"] || {};
    const builder = this.getFormRenderer();
    const options = this.getFormOptionsForAction(action, structure);
    builder.createForm(container, structure, action, tupleData, options);

    this.decorateForm(action, tupleData);
    return container.querySelector("form");
  }

  decorateForm(action, tupleData = {}) {
    const wrapper = document.getElementById("Div_IU_form");
    if (wrapper) {
      wrapper.style.display = "block";
    }

    this.setupFileFieldBehaviour(tupleData);

    const langManager = window.generalUIManager?.languageManager;
    if (langManager?.refreshRegisteredTranslations) {
      langManager.refreshRegisteredTranslations();
    } else if (typeof setLang === "function") {
      setLang(langManager?.getActiveLanguage?.());
    }
  }

  setupFileFieldBehaviour(tupleData = {}) {
    const form = document.getElementById("form_iu");
    if (!form) return;

    const fileInput = form.querySelector(
      '[data-attribute-name="nuevo_foto_persona"]',
    );
    const nameInput = this.ensureFotoPersonaField(tupleData);

    if (fileInput) {
      fileInput.addEventListener("change", () => {
        const file = fileInput.files?.[0] || null;
        if (nameInput) {
          nameInput.value = file?.name || tupleData.foto_persona || "";
        }
        this.renderFotoPersonaPreview({
          file,
          fileName: nameInput?.value || "",
        });
      });
    }

    this.renderFotoPersonaPreview({
      fileName: nameInput?.value || tupleData.foto_persona || "",
    });
  }

  ensureFotoPersonaField(tupleData = {}) {
    const form = document.getElementById("form_iu");
    if (!form) return null;

    let nameInput = form.querySelector('[data-attribute-name="foto_persona"]');
    if (!nameInput) {
      nameInput = document.createElement("input");
      nameInput.type = "hidden";
      nameInput.id = "foto_persona";
      nameInput.name = "foto_persona";
      nameInput.setAttribute("data-attribute-name", "foto_persona");
      form.appendChild(nameInput);
    } else {
      nameInput.readOnly = true;
    }

    nameInput.value = tupleData.foto_persona || nameInput.value || "";
    return nameInput;
  }

  renderFotoPersonaPreview({ file = null, fileName = "" } = {}) {
    const form = document.getElementById("form_iu");
    const fotoField = form?.querySelector(
      '[data-attribute-name="foto_persona"]',
    );
    const fileField = form?.querySelector(
      '[data-attribute-name="nuevo_foto_persona"]',
    );
    const wrapper =
      (fileField || fotoField)?.closest(".form-group") ||
      fileField?.parentElement ||
      fotoField?.parentElement;
    if (!wrapper) return;

    const previousPreview = wrapper.querySelector(".file-preview");
    if (previousPreview) {
      previousPreview.remove();
    }

    const preview = document.createElement("div");
    preview.className = "file-preview";

    if (file) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      img.className = "file-preview__thumb";
      img.onload = () => URL.revokeObjectURL(img.src);
      preview.appendChild(img);

      const nameTag = document.createElement("p");
      nameTag.textContent = file.name;
      preview.appendChild(nameTag);
    } else if (fileName) {
      const link = document.createElement("a");
      link.className = "link_foto_persona";
      link.href = `http://193.147.87.202/ET2/filesuploaded/files_foto_persona/${fileName}`;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = "./iconos/FILE.png";
      img.alt = "foto_persona";
      link.appendChild(img);

      const label = document.createElement("span");
      label.textContent = fileName;

      preview.appendChild(link);
      preview.appendChild(label);
    }

    if (preview.children.length > 0) {
      wrapper.appendChild(preview);
    }
  }

  validateFileAttributeFromStructure(attributeName, action) {
    const structure = this.getStructure?.();
    const rulesForAction =
      structure?.attributes?.[attributeName]?.rules?.validations?.[action] ||
      {};
    const input = document.querySelector(
      `[data-attribute-name="${attributeName}"]`,
    );
    const fileValue = input?.files?.[0] || null;

    const validationResult = this.validations.validateValueAgainstRules(
      fileValue,
      rulesForAction,
      {
        attributeName,
        action,
        entityInstance: this,
      },
    );

    if (!validationResult.isValid) {
      const codeToShow = validationResult.errorCodes?.[0] || "ERR_PERSONALIZED";
      if (this.dom?.mostrar_error_campo) {
        this.dom.mostrar_error_campo(attributeName, codeToShow);
      }
      return codeToShow;
    }

    if (this.dom?.mostrar_exito_campo) {
      this.dom.mostrar_exito_campo(attributeName);
    }
    return true;
  }

  /**********************************************************************************************
		fields validations for ADD
	***********************************************************************************************/

  funcion_input_y_textarea(
    accion_restriccion_claves,
    accion_restriccion_valores,
    restriccion,
  ) {
    if (
      !this.validations.accion_restriccion_claves[restriccion](
        atributo,
        accion_restriccion_valores[restriccion],
      )
    ) {
      this.dom.mostrar_error_campo(
        atributo,
        accion_restriccion_claves[restriccion],
      );
      return accion_restriccion_claves[restriccion];
    }
    if (accion_restriccion_claves[restriccion] == "personalized") {
      let llamada = "this." + "personalize_" + atributo + "()";
      var resp = llamada;
      if (!(resp === true)) {
        this.dom.mostrar_error_campo(atributo, resp);
        return resp;
      }
    }
  }

  /*
        funcion_multiple(type, accion_restriccion_claves, restriccion, atributo, multiple) {
                if (atributo_html_tag == "select") { // select múltiple
                        var titulacion = document.getElementsByName(attibute);
                        var titulaciones_permitidas = [];

                        for (var i=0;i<multiple_options.length;i++) {
                                titulaciones_permitidas.push(titulacion[i].value);
                        }

                        if (titulaciones_permitidas.includes(document.getElementById(attribute).value)){
                                this.dom.mostrar_exito_campo(attribute);
                                return true;
                        }
                        else{
                                if (document.getElementById(attribute).value == ''){
                                        this.dom.mostrar_error_campo(attribute,error);
                                        return error;
                                }
                                else{
                                        this.dom.mostrar_error_campo(attribute,error);
                                        return error;
                                }
                        }
                }
        }
        */

  funcion_not_multiple(
    accion_restriccion_claves,
    restriccion,
    attribute,
    error,
  ) {
    if (atributo_html_tag == "select") {
      // select no múltiple
      var titulacion = document.getElementsByName(attibute);
      var titulaciones_permitidas = [];

      for (var i = 0; i < multiple_options.length; i++) {
        titulaciones_permitidas.push(titulacion[i].value);
      }

      if (
        titulaciones_permitidas.includes(
          document.getElementById(attribute).value,
        )
      ) {
        this.dom.mostrar_exito_campo(attribute);
        return true;
      } else {
        if (document.getElementById(attribute).value == "") {
          this.dom.mostrar_error_campo(attribute, error);
          return error;
        } else {
          this.dom.mostrar_error_campo(attribute, error);
          return error;
        }
      }
    } else if (atributo_html_tag == "radio") {
      // radio
      var radio = document.getElementsByName(attibute);
      var contador = 0;
      var valores = [];

      for (var i = 0; i < radio.length; i++) {
        valores.push(radio[i].value);
      }

      for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
          if (valores.includes(radio[i].value)) {
            contador++;
          } else {
            if (radio[i].value == "") {
            } else {
              this.dom.mostrar_error_campo(attribute, error);
              return error;
            }
          }
        }
      }

      var codeerror = "";

      switch (contador) {
        case 1:
          this.dom.mostrar_exito_campo(attribute);
          return true;
        default:
          codeerror = error;
          break;
      }

      this.dom.mostrar_error_campo(attribute, codeerror);
      return codeerror;
    } else {
      // checkbox
      var checkbox = document.getElementsByName(attribute);
      var valores = [];

      for (var i = 0; i < checkbox.length; i++) {
        valores.push(checkbox[i].value);
      }

      for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
          if (valores.includes(checkbox[i].value)) {
            return true;
          }
        }
      }
      return error;
    }
  }

  funciones() {
    const funcion = {
      [atributo]: function (
        accion_restriccion_claves,
        accion_restriccion_valores,
        restriccion,
      ) {
        // min_size, max_size, etc
        for (
          var restriccion = 0;
          restriccion < accion_restriccion_claves.lenght;
          restriccion++
        ) {
          if (tag == "input" || tag == "textarea") {
            // input: text, date, tel, email, file
            funcion_input_y_textarea(
              accion_restriccion_claves,
              accion_restriccion_valores,
              restriccion,
            );
          } else if (
            atributo_html_tag == "select" &&
            atributo[2][1] == "multiple"
          ) {
            // select: multiple (true or false), options (length)
            funcion_multiple(accion_restriccion_claves, restriccion, atributo);
          } else {
            // select: options (length)
            // radio: options (length)
            // checkbox: multiple (true or false), options (length) (si es false no existe)
            funcion_not_multiple(
              accion_restriccion_claves,
              restriccion,
              atributo,
            );
          }
          this.dom.mostrar_exito_campo(atributo);
          return true;
        }
      },
    };
  }

  validaciones() {
    // Datos necesarios
    let nombreDeLaEntidad = estructura_nombreentidad[0];
    let attributesCounter = estructura_nombreentidad[1].lenght; // obtener nº de atributos de la entidad

    if (attributesCounter < 1) {
      return true;
    } // si no tiene atributos no hay nada que comprobar

    // atributos, predeterminado: primer atributo
    let atributo; // = estructura_nombreentidad[1][0];
    // let atributo_is_null = estructura_nombreentidad[1][1];

    /*
                input: text, date, tel, email, file,
                textarea: row y columns
                select: options.length
                select: multiple (true or false), options.length
                checkbox: multiple (true or false), options.length (si es false no existe)
                radio: options.length
                */

    let atributo_html_tag; // = atributo[2][0]; // input, checkbox...
    let atributo_html_type_or_multiple; // = tributo[2][1]; // text, date... para input, multiple para demás
    // let atributo_html_component_visible = estructura_nombreentidad[1][0][2][2];
    let atributo_rules; // = atributo[3];
    let atributo_rules_validations; // = atributo[3][0].length; // ¿ADD, EDIT y SEARCH?
    let multiple_options;

    for (var i = 0; i < attributesCounter; i++) {
      atributo = estructura_nombreentidad[1][i];
      atributo_html_tag = atributo[2][0]; // input, checkbox...
      if (atributo_html_tag == "input" || atributo_html_tag == "textarea") {
        if (atributo_html_tag == "input") {
          atributo_html_type_or_multiple = atributo[2][1];
        } // text, date...
      } else if (
        atributo_html_tag == "select" &&
        atributo[2][1] == "multiple"
      ) {
        if (atributo[2][1] != false) {
          let multiple_options = atributo[2][2];
        }
      } else {
      }

      atributo_rules = atributo[3];
      atributo_rules_validations = atributo_rules[0].length; // ¿ADD, EDIT y SEARCH?

      for (var j = 0; j < atributo_rules_validations; j++) {
        let accion = atributo_rules_validations[j]; // ¿ADD, EDIT o SEARCH?
        let accion_cantidad_restricciones = accion.length; //
        // const claves = Object.keys(ADD);

        let llamada_a_funcion = accion + "-" + atributo + "_validation";

        for (var k = 0; k < accion_cantidad_restricciones; k++) {
          let accion_restriccion = accion_cantidad_restricciones[k];

          let accion_restriccion_claves = Object.keys(accion_restriccion); // min_size, max_size, etc
          let accion_restriccion_valores = Object.values(accion_restriccion); // 9, 200, etc

          if (atributo_html_tag == "input" || atributo_html_tag == "textarea") {
            llamada_a_funcion(
              accion_restriccion_claves,
              accion_restriccion_valores,
              restriccion,
            );
          } else if (
            atributo_html_tag == "select" &&
            atributo[2][1] == "multiple"
          ) {
          } else {
            let multiple_options = atributo[2][2];
            llamada_a_funcion(
              atributo_html_type,
              accion_restriccion_claves,
              accion_restriccion_valores,
              restriccion,
            );

            let not_multiple_options = atributo[2][2];
            llamada_a_funcion(
              atributo_html_type,
              accion_restriccion_claves,
              accion_restriccion_valores,
              restriccion,
            );
          }
        }
      }
    }
  }

  ADD_submit_persona() {
    let result =
      this.ADD_dni_validation() &
      this.ADD_nombre_persona_validation() &
      this.ADD_nuevo_foto_persona_validation() &
      this.ADD_titulacion_persona_validation();
    result = Boolean(result);
    return result;
  }

  personalize_dni_nie(valor, { showDomErrors = true } = {}) {
    const dni = valor ?? document.getElementById("dni")?.value ?? "";
    const dniFormatResult = this.personalize_dni_format(dni, { showDomErrors });
    if (dniFormatResult === true) {
      if (!this.personalize_validate_dni(dni)) {
        if (showDomErrors && this.dom?.mostrar_error_campo) {
          this.dom.mostrar_error_campo("dni", "dni_validate_KO");
        }
        return "dni_validate_KO";
      }
    } else {
      const nieFormatResult = this.personalize_nie_format(dni, {
        showDomErrors,
      });
      if (nieFormatResult === true) {
        if (!this.personalize_validate_nie(dni)) {
          if (showDomErrors && this.dom?.mostrar_error_campo) {
            this.dom.mostrar_error_campo("dni", "nie_validate_KO");
          }
          return "nie_validate_KO";
        }
      } else {
        return "dni_nie_format_KO";
      }
    }

    return true;
  }

  /**
   * get dni as parameter, split letter and numbers, calculate
   * %23 from number to obtain corresponding letter and compares with letter in dni value
   *
   * @param dni value
   * @returns true if dni is valid false otherwise
   */
  personalize_dni_format(valor, { showDomErrors = true } = {}) {
    const dniValue = valor ?? document.getElementById("dni")?.value ?? "";
    if (!/^[0-9]{8}[A-Z]$/.test(dniValue)) {
      if (showDomErrors && this.dom?.mostrar_error_campo) {
        this.dom.mostrar_error_campo("dni", "dni_format_KO");
      }
      return "dni_format_KO";
    }
    return true;
  }

  personalize_nie_format(valor, { showDomErrors = true } = {}) {
    const nieValue = valor ?? document.getElementById("dni")?.value ?? "";
    if (!/^[XYZ][0-9]{7}[A-Z]$/.test(nieValue)) {
      if (showDomErrors && this.dom?.mostrar_error_campo) {
        this.dom.mostrar_error_campo("dni", "nie_format_KO");
      }
      return "nie_format_KO";
    }
    return true;
  }
  personalize_validate_dni(dni) {
    var dni_letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    var letter = dni_letters.charAt(parseInt(dni, 10) % 23);

    return letter == dni.charAt(8);
  }

  /**
   * get nie as parameter, split firts letter, calculate
   * the number from this letter and create dni for validating in
   * personalizate method
   *
   * @param nie value
   * @returns true if nie is valid false otherwise
   */
  personalize_validate_nie(nie) {
    //var nie = document.getElementById('dni').value;
    // Change the initial letter for the corresponding number and validate as DNI
    var nie_prefix = nie.charAt(0);

    switch (nie_prefix) {
      case "X":
        nie_prefix = 0;
        break;
      case "Y":
        nie_prefix = 1;
        break;
      case "Z":
        nie_prefix = 2;
        break;
    }

    return this.personalize_validate_dni(nie_prefix + nie.substr(1));
  }

  ADD_titulacion_persona_validation() {
    if (document.getElementById("titulacion_persona").value == "PCEO") {
      return true;
    } else {
      return "titulacion_persona_valor_KO";
    }
  }

  createForm_EDIT(fila) {
    this.renderActionForm("EDIT", fila || {});
  }

  createForm_DELETE(fila) {
    this.renderActionForm("DELETE", fila || {});
  }

  createForm_SHOWCURRENT(fila) {
    this.renderActionForm("SHOWCURRENT", fila || {});
  }

  createForm_ADD() {
    this.renderActionForm("ADD");
  }

  createForm_SEARCH() {
    this.renderActionForm("SEARCH");
  }

  SEARCH() {
    console.log("EntidadAbstracta::SEARCH", this.nombreentidad);
    this.access_functions
      .peticionBackGeneral("form_iu", this.nombreentidad, "SEARCH")
      .then((respuesta) => {
        //limpiar el formulario
        //document.getElementById('contenedor_IU_form').innerHTML = this.manual_form_creation();
        this.dom.hide_element("Div_IU_form");

        if (respuesta["code"] == "RECORDSET_DATOS") {
          this.datos = respuesta["resource"];
          this.atributos = Object.keys(this.datos[0]);
          this.dom.remove_class_value("IU_manage_table", "RECORDSET_");
          //crear la tabla de datos de la entidad del back
          this.crearTablaDatos(this.datos, this.mostrarespecial);
        } else {
          this.dom.assign_property_value(
            "IU_manage_table",
            "style.display",
            "block",
          );
          this.dom.remove_class_value("IU_manage_table", "RECORDSET_");
          this.dom.assign_class_value("IU_manage_table", "RECORDSET_VACIO");
          //document.getElementById("IU_manage_table").style.display = 'block';
          //document.getElementById('IU_manage_table').innerHTML = 'No se han encontrado elementos que coincidan con la búsqueda';
          //document.getElementById('IU_manage_table').className = 'RECORDSET_VACIO';
        }

        setLang();
      });
  }

  collectSearchFormValues() {
    const form = document.querySelector("#contenedor_IU_form form");
    const structure =
      this.getStructure?.() || window["estructura_persona"] || {};
    const attributes = structure.attributes || {};
    const data = {};

    Object.keys(attributes).forEach((attributeName) => {
      const elements = form?.querySelectorAll(
        `[data-attribute-name="${attributeName}"]`,
      );
      if (!elements || elements.length === 0) {
        return;
      }

      const first = elements[0];
      if (first.type === "radio") {
        const checked = Array.from(elements).find((el) => el.checked);
        data[attributeName] = checked ? checked.value : "";
        return;
      }

      if (first.type === "checkbox") {
        data[attributeName] = Array.from(elements)
          .filter((el) => el.checked)
          .map((el) => el.value);
        return;
      }

      if (first.tagName === "SELECT" && first.multiple) {
        data[attributeName] = Array.from(first.selectedOptions).map(
          (opt) => opt.value,
        );
        return;
      }

      data[attributeName] = first.value ?? "";
    });

    return data;
  }

  matchesFilter(recordValue, filterValue) {
    if (filterValue === undefined || filterValue === null) return true;
    if (Array.isArray(filterValue)) {
      if (filterValue.length === 0) return true;
      if (Array.isArray(recordValue)) {
        return filterValue.every((value) => recordValue.includes(value));
      }
      return false;
    }
    if (filterValue === "") return true;
    const normalizedFilter = String(filterValue).toLowerCase();
    if (Array.isArray(recordValue)) {
      return recordValue.some((value) =>
        String(value).toLowerCase().includes(normalizedFilter),
      );
    }
    if (recordValue === undefined || recordValue === null) return false;
    return String(recordValue).toLowerCase().includes(normalizedFilter);
  }

  renderSearchResults(results = []) {
    const container = document.getElementById("IU_manage_table");
    if (!container) return;

    const builder =
      window.uiManager?.formRenderer ||
      new DOMFormTableBuilder({
        languageManager: window.generalUIManager?.languageManager,
      });
    const structure =
      this.getStructure?.() || window["estructura_persona"] || {};
    const visibleAttributes = Object.keys(structure.attributes || {}).filter(
      (attr) => attr !== "nuevo_foto_persona",
    );

    builder.createDataTable(container, structure, results, {
      visibleAttributes,
      actions: ["SHOWCURRENT", "EDIT"],
      onActionClick: (action, rowIndex, rowData) => {
        if (action === "SHOWCURRENT") {
          window.uiManager?.refreshShowCurrentView?.(rowData);
        }
        if (action === "EDIT") {
          window.uiManager?.refreshEditView?.(rowData);
        }
      },
    });

    container.style.display = "block";
  }

  /**
   * modifica el formato de visualización de un atributo concreto y se devuelve el valor modificado
   * en el caso de solicitar cambio de formato para un atributo no implementado se lanza una alerta
   *
   * @param {String} atributo string con el nombre del atributo a modificar su valor
   * @param {String} valorentrada string con el valor de entrada a modificar
   * @returns
   */
  mostrarcambioatributo(atributo, valorentrada) {
    switch (atributo) {
      case "fechaNacimiento_persona":
        var elementos = valorentrada.split("-");

        var day = elementos[2];
        var month = elementos[1];
        var year = elementos[0];

        return day + "/" + month + "/" + year;
        break;
      case "foto_persona":
        var link = "error";
        if (valorentrada !== "") {
          link =
            valorentrada +
            `  <a class="link_foto_persona" href="http://193.147.87.202/ET2/filesuploaded/files_foto_persona/` +
            valorentrada +
            `"><img src="./iconos/FILE.png" /></a>`;
        }
        return link;
        break;
      case "default":
        const langManager = window?.generalUIManager?.languageManager;
        const message =
          langManager?.getText?.("error.attribute.special.format") ||
          "No existe una configuración especial para mostrar este atributo.";
        alert(message);
        break;
    }
  }
}
