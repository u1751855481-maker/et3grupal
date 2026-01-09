// Estructura dinámica de la entidad persona para ET3.
const estructura_persona = {
  entity: "persona",
  attributes: {
    dni: {
      label: "DNI",
      is_null: false,
      html: {
        tag: "input",
        type: "text",
        component_visible_size: 9,
      },
      rules: {
        validations: {
          ADD: {
            min_size: 9,
            max_size: 9,
            exp_reg: "^[0-9XYZ][0-9]{7}[A-Z]$",
            personalized: true,
          },
          EDIT: {
            min_size: 9,
            max_size: 9,
            exp_reg: "^[0-9XYZ][0-9]{7}[A-Z]$",
            personalized: true,
          },
          SEARCH: {
            max_size: 9,
            exp_reg: "^[0-9XYZ]?[0-9]{0,7}[A-Z]?$",
          },
        },
      },
    },
    nombre_persona: {
      label: "Nombre",
      is_null: false,
      html: {
        tag: "input",
        type: "text",
        component_visible_size: 20,
      },
      rules: {
        validations: {
          ADD: {
            min_size: 2,
            max_size: 40,
            exp_reg: "^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ ]+$",
          },
          EDIT: {
            min_size: 2,
            max_size: 40,
            exp_reg: "^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ ]+$",
          },
          SEARCH: { max_size: 40 },
        },
      },
    },
    apellidos_persona: {
      label: "Apellidos",
      is_null: false,
      html: {
        tag: "input",
        type: "text",
        component_visible_size: 40,
      },
      rules: {
        validations: {
          ADD: {
            min_size: 2,
            max_size: 60,
            exp_reg: "^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ ]+$",
          },
          EDIT: {
            min_size: 2,
            max_size: 60,
            exp_reg: "^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ ]+$",
          },
          SEARCH: { max_size: 60 },
        },
      },
    },
    fechaNacimiento_persona: {
      label: "Fecha de nacimiento",
      is_null: false,
      html: {
        tag: "input",
        type: "date",
        component_visible_size: 12,
      },
      rules: {
        validations: {
          ADD: { exp_reg: "^\\d{4}-\\d{2}-\\d{2}$" },
          EDIT: { exp_reg: "^\\d{4}-\\d{2}-\\d{2}$" },
          SEARCH: {},
        },
      },
    },
    direccion_persona: {
      label: "Dirección",
      is_null: false,
      html: {
        tag: "textarea",
        rows: 4,
        columns: 40,
      },
      rules: {
        validations: {
          ADD: { min_size: 5, max_size: 200 },
          EDIT: { min_size: 5, max_size: 200 },
          SEARCH: { max_size: 200 },
        },
      },
    },
    telefono_persona: {
      label: "Teléfono",
      is_null: false,
      html: {
        tag: "input",
        type: "tel",
        component_visible_size: 9,
      },
      rules: {
        validations: {
          ADD: { min_size: 9, max_size: 9, exp_reg: "^\\d{9}$" },
          EDIT: { min_size: 9, max_size: 9, exp_reg: "^\\d{9}$" },
          SEARCH: { max_size: 9 },
        },
      },
    },
    email_persona: {
      label: "Email",
      is_null: false,
      html: {
        tag: "input",
        type: "email",
        component_visible_size: 40,
      },
      rules: {
        validations: {
          ADD: { max_size: 60, exp_reg: "^[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}$" },
          EDIT: {
            max_size: 60,
            exp_reg: "^[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}$",
          },
          SEARCH: { max_size: 60 },
        },
      },
    },
    titulacion_persona: {
      label: "Titulación",
      is_null: false,
      html: {
        tag: "select",
        options: ["GREI", "GRIA", "MEI", "MIA", "PCEO"],
      },
      rules: {
        validations: {
          ADD: { min_size: 3, max_size: 4 },
          EDIT: { min_size: 3, max_size: 4 },
          SEARCH: {},
        },
      },
    },
    menu_persona: {
      label: "Menú",
      is_null: true,
      html: {
        tag: "checkbox",
        multiple: true,
        options: ["Vegano", "Celíaco", "Alergia Marisco"],
      },
      rules: {
        validations: {
          ADD: {},
          EDIT: {},
          SEARCH: {},
        },
      },
    },
    habilidades_persona: {
      label: "Habilidades",
      is_null: false,
      html: {
        tag: "select",
        multiple: true,
        options: ["JavaScript", "Python", "DevOps", "Ciberseguridad"],
      },
      rules: {
        validations: {
          ADD: { min_size: 1, max_size: 3 },
          EDIT: { min_size: 1, max_size: 3 },
          SEARCH: { max_size: 4 },
        },
      },
    },
    genero_persona: {
      label: "Género",
      is_null: false,
      html: {
        tag: "radio",
        options: ["Masculino", "Femenino", "Otro"],
      },
      rules: {
        validations: {
          ADD: { exp_reg: "^(Masculino|Femenino|Otro)$" },
          EDIT: { exp_reg: "^(Masculino|Femenino|Otro)$" },
          SEARCH: {},
        },
      },
    },
    acepta_privacidad: {
      label: "Acepta privacidad",
      is_null: false,
      html: {
        tag: "checkbox",
        multiple: false,
      },
      rules: {
        validations: {
          ADD: { required: true },
          EDIT: { required: true },
          SEARCH: {},
        },
      },
    },
    foto_persona: {
      label: "Foto",
      is_null: true,
      html: {
        tag: "input",
        type: "text",
        component_visible_size: 40,
      },
      rules: {
        validations: {
          ADD: { max_size: 100 },
          EDIT: { max_size: 100 },
          SEARCH: { max_size: 100 },
        },
      },
    },
    nuevo_foto_persona: {
      label: "Nueva foto",
      is_null: true,
      html: {
        tag: "input",
        type: "file",
        multiple: false,
      },
      rules: {
        validations: {
          ADD: {
            no_file: true,
            max_size_file: [{ max_size_file: 2000000 }],
            type_file: [
              { type_file: "image/jpeg" },
              { type_file: "image/png" },
            ],
            format_name_file: [
              { format_name_file: "^[A-Za-z0-9_.-]+\\.(jpg|jpeg|png)$" },
            ],
          },
          EDIT: {
            max_size_file: [{ max_size_file: 2000000 }],
            type_file: [
              { type_file: "image/jpeg" },
              { type_file: "image/png" },
            ],
            format_name_file: [
              { format_name_file: "^[A-Za-z0-9_.-]+\\.(jpg|jpeg|png)$" },
            ],
          },
          SEARCH: {},
        },
      },
    },
  },
};

if (typeof window !== "undefined") {
  window.estructura_persona = estructura_persona;
}
