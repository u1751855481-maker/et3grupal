// Estructura dinámica mínima para la entidad producto.
const estructura_producto = {
    entity: 'producto',
    attributes: {
        codigo_producto: {
            label: 'codigo_producto',
            html: {
                tag: 'input',
                type: 'text',
                component_visible_size: 12,
            },
            rules: {
                validations: {
                    ADD: { min_size: 2, max_size: 12, exp_reg: '^[A-Za-z0-9_-]+$' },
                    EDIT: { min_size: 2, max_size: 12, exp_reg: '^[A-Za-z0-9_-]+$' },
                    SEARCH: { max_size: 12, exp_reg: '^[A-Za-z0-9_-]*$' },
                },
            },
        },
        nombre_producto: {
            label: 'nombre_producto',
            html: {
                tag: 'input',
                type: 'text',
                component_visible_size: 50,
            },
            rules: {
                validations: {
                    ADD: { min_size: 2, max_size: 60, exp_reg: "^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ0-9 '()-]+$" },
                    EDIT: { min_size: 2, max_size: 60, exp_reg: "^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ0-9 '()-]+$" },
                    SEARCH: { max_size: 60 },
                },
            },
        },
        descripcion_producto: {
            label: 'descripcion_producto',
            html: {
                tag: 'textarea',
                rows: 3,
                columns: 40,
            },
            rules: {
                validations: {
                    ADD: { max_size: 200 },
                    EDIT: { max_size: 200 },
                    SEARCH: { max_size: 200 },
                },
            },
        },
    },
};
