# AGENTS.md – Proyecto ET3 (Interfaz genérica de gestión de entidades)

Piensa en este archivo como el **briefing para agentes de código** que trabajan sobre este proyecto ET3.  
Aquí se describe:

- Qué hace (y debe hacer) la aplicación.
- Cómo está organizada.
- Qué está funcionando, qué está a medias y qué falta por implementar.
- Reglas y restricciones importantes para modificar el código.

El objetivo es que cualquier agente (o desarrollador) pueda entender el contexto y avanzar de forma alineada.

---

## 1. Objetivo del proyecto

Este proyecto implementa una **interfaz genérica de gestión de entidades (ET3)** en HTML/JS/CSS puro.

Características clave esperadas:

- Pantalla principal común: título, menú de entidades, banderas de idioma, tabla con datos del equipo.
- Gestión de entidades (actualmente **persona**, en el futuro **producto**, **coche**, etc.).
- Para cada entidad, soportar acciones:
  - `SEARCH` – Buscar registros.
  - `ADD` – Alta.
  - `EDIT` – Modificación.
  - `DELETE` – Baja (si aplica).
  - `SHOWCURRENT` – Ver detalle de un registro.
  - `Tests` – Pruebas de UI/datos para esa entidad.
- La UI **no** debe estar cableada a una entidad concreta:
  - Formularios, tablas y validaciones se generan leyendo una **estructura de entidad** en JS (p. ej. `estructura_persona`).
  - Añadir una entidad nueva debe requerir solo **añadir su estructura (y opcionalmente clase)**, sin tocar el core.

---

## 2. Estado actual (alto nivel)

Resumen basado en el análisis previo del código y los errores de consola que se han compartido:

- La entidad **`persona`** existe como clase (`persona_Class.js`) y estructura (`estructura_persona`).
- El **core genérico** está presente conceptualmente:
  - `Base/EntidadAbstracta.js` (clase base, o equivalente).
  - `Core/GeneralUIManager.js` (gestiona carga de entidad, acciones, idioma, etc.).
  - `Core/DOMFormTableBuilder.js` (construcción dinámica de formularios y tablas).
  - `Core/Validations_Class.js` (validaciones atómicas y por acción).
  - Sistema de idioma: `locale/idioma.js`, `app/Textos_ES.js`, `app/Textos_EN.js`.
  - Datos del equipo: `ET3_Datos_NombreEquipo.js`.
  - Fichero principal: `index.html`.
  - Fichero de estilos: `IU.css`.
  - Tests: `Unit_Test_Class.js` (se han visto logs tipo `Unit_Test_Class.js:179` con ~35 tests).
- El menú de entidades incluye al menos la opción **“Gestionar persona”**.
- Hay soporte de **multiidioma** (banderas ES/EN y textos parametrizados).

### 2.1. Lo que parece estar **funcionando** o encaminado

- **Carga de la aplicación** desde `index.html`.
- **Lectura dinámica** de `ET3_Datos_NombreEquipo.js` y renderizado de la tabla de datos del equipo.
- **Cambio de idioma** ES/EN a través de banderas, afectando a textos de la interfaz.
- **Core de validaciones genéricas** en `Validations_Class.js` (min_size, max_size, regex, ficheros, fechas, etc.).
- **Estructura de entidad `persona`** que define atributos, HTML y reglas de validación por acción.
- **Ejecución de tests** (al menos a nivel de logging) vía `Unit_Test_Class.js`.

### 2.2. Lo que está **parcialmente implementado**

- **Interfaz genérica por entidad**:
  - Existe `GeneralUIManager.js` y `DOMFormTableBuilder.js` para construir formularios/tablas a partir de estructuras genéricas.
  - Sin embargo, la entidad `persona` sigue usando mucho código manual en `persona_Class.js` (métodos `createForm_ADD`, `createForm_SEARCH`, etc.), en lugar de apoyarse completamente en el form-builder genérico.
- **Validaciones personalizadas**:
  - Hay métodos específicos en `persona_Class.js` (por ejemplo, validaciones sobre DNI/NIE).
  - Se ejecutan en algunos puntos (p. ej., durante el submit de ADD), pero **no parecen integradas de forma homogénea en la validación campo a campo** (onblur/onchange).
- **Tests de IU y datos**:
  - Existen clases de test y se logran arrays de casos (35 tests según consola).
  - No está completamente claro hasta qué punto cubren todas las acciones (ADD, EDIT, SEARCH, SHOWCURRENT) para persona y futuras entidades.

### 2.3. Lo que está **incompleto o pendiente**

- **Búsqueda (SEARCH) y tabla de resultados**:
  - Falta una implementación clara y completa que:
    - Valide el formulario SEARCH según `rules.validations.SEARCH`.
    - Ejecute una búsqueda (aunque sea simulada con datos dummy).
    - Construlla la tabla de resultados dinámicamente con `DOMFormTableBuilder` (cabeceras desde atributos visibles, filas por registro, iconos de acción para EDIT/SHOWCURRENT, etc.).
- **Uso 100% genérico para PERSONA**:
  - Ahora mismo la entidad `persona` mezcla:
    - Estructura genérica (`estructura_persona`).
    - Lógica manual de creación de formularios en la clase concreta.
  - El objetivo es que la UI para persona se genere igual que para cualquier otra entidad, **solo leyendo su estructura**, sin HTML ni lógica duplicada.
- **Soporte real a nuevas entidades (ej. `producto`)**:
  - Está descrito el flujo para añadir una nueva entidad (estructura `estructura_producto`, clase opcional `producto`, registro en `entitiesConfig`, textos en ES/EN).
  - Pero en el repositorio solo hay constancia de `persona`. No se han añadido aún varias entidades nuevas (mínimo tres) para probar el core genérico.
- **Integración de validaciones personalizadas en el flujo estándar**:
  - La estructura de atributos puede marcar `personalized: true`.
  - Falta un punto central (probablemente en `GeneralUIManager` o en el mecanismo de validación de campo) que llame automáticamente a `specialized_test_<atributo>()` cuando esté activada esa marca, tanto en validación de campo como de formulario.
- **API.html**:
  - Debe documentar todas las funciones y métodos reales (UIManager, Validations_Class, DOMFormTableBuilder, clases de entidad, tests, etc.).
  - Es probable que la documentación actual no refleje con precisión todas las funciones y parámetros implementados.

---

## 3. Errores conocidos (muy importantes para agentes)

### 3.1. Error de consola `dni is not defined`

Errores observados (resumen textual de los logs proporcionados):

- En `persona_Class.js:330`:
  - `Uncaught ReferenceError: dni is not defined`
  - En el método `persona.personalize_dni_nie`.
  - Llamado desde `persona.ADD_dni_validation` (onblur) y desde `persona.ADD_submit_persona` (onsubmit).
- Se repite al escribir en el campo DNI y al intentar hacer ADD.
- También se observa:
  - `GeneralUIManager.js:255 Formulario válido para acción ADD {}` (es decir, las validaciones genéricas dan el OK).
  - Acto seguido, la llamada a la validación personalizada revienta por la variable `dni` no declarada.

**Conclusión para agentes**:

- Hay que revisar `personalize_dni_nie` en `persona_Class.js`:
  - Probablemente se hace algo como `dni = document.getElementById('dni').value;` sin `let/var/const`.
  - Corregir con una variable local (`const dni = ...`) o leer el valor desde los parámetros que le llegan al método.
- Este error impide completar correctamente la acción ADD para `persona`.

---

## 4. Flujo funcional esperado para la aplicación

Esta sección resume **cómo debe funcionar la aplicación cuando esté completa**, según las especificaciones de la entrega ET3.

### 4.1. Entrada a la aplicación

1. El usuario abre `index.html`.
2. Se muestra:
   - Cabecera con título (p.ej. “Interfaz ET2/ET3 IU”).
   - Banderas de idioma (ES / EN).
   - Menú con entidades (por ahora “Gestionar persona”; en el futuro más).
   - Tabla “Datos del equipo” construida dinámicamente a partir de `ET3_Datos_NombreEquipo.js`.
3. La zona de gestión de entidades está inicialmente oculta hasta que se selecciona una entidad en el menú.

### 4.2. Cambio de idioma

- Al hacer clic en la bandera ES/EN:
  - Se cambia el idioma activo en el gestor de idioma.
  - Se refrescan:
    - Textos estáticos (títulos, labels, botones…).
    - Textos de mensajes y códigos de error.
  - El contenido de los campos (valores introducidos por el usuario) **no debe perderse**.

### 4.3. Selección de entidad (ejemplo: `persona`)

1. El usuario hace clic en “Gestionar persona”.
2. El core (`UIManager`) debe:
   - Instanciar `persona` (clase concreta) **o** una entidad genérica con `estructura_persona`.
   - Obtener su estructura (objeto que incluye `entity` y `attributes`).
   - Guardar `currentEntity` y `currentStructure`.
   - Mostrar la sección de gestión de entidad (`IU_manage_entity`).
   - Pintar por defecto el formulario de `SEARCH` para esa entidad.

### 4.4. Acción `SEARCH`

- El formulario de búsqueda se genera leyendo `estructura_persona.attributes[...].html` y las reglas de búsqueda.
- El usuario rellena criterios (DNI, nombre, etc.).
- Validación:
  - En cada campo (onblur/onchange) se ejecutan las validaciones de `SEARCH`.
  - Al hacer submit:
    - Se realiza validación global de `SEARCH`.
    - Si hay errores: se muestran mensajes por campo + resumen general, NO se hace la búsqueda.
    - Si todo es correcto:
      - Se realiza la búsqueda (por ahora simulada / datos dummy).
      - Se construye una **tabla de resultados** dinámica:
        - Cabeceras a partir de atributos visibles.
        - Una fila por registro.
        - Iconos por fila para `SHOWCURRENT`, `EDIT`, etc.

### 4.5. Acción `SHOWCURRENT`

- Al seleccionar un registro (desde la tabla de resultados):
  - Se cambia a modo `SHOWCURRENT`.
  - Se muestra un formulario de solo lectura con todos los datos del registro.
  - No se realizan validaciones (no se edita nada).

### 4.6. Acción `ADD` (alta)

- Al pulsar el icono de ADD:
  - Se genera un formulario de alta a partir de la estructura (`rules.validations.ADD`).
- Validación:
  - Por campo (onblur): min_size, max_size, regex, ficheros, fechas, y eventualmente reglas personalizadas (`specialized_test_*`).
  - Global (submit): recorre todos los campos y aplica todas las reglas.
- Si todo es válido:
  - Se muestra mensaje “Alta correcta” (y en el futuro se llamará al backend a través de `ExternalAccess_class.js`).
- Si hay errores:
  - Se marcan campos en rojo.
  - Se muestra resumen de errores.
  - Se enfoca el primer campo con error.

### 4.7. Acción `EDIT`

- Desde la tabla de resultados, el usuario elige editar un registro.
- La UI:
  - Carga los datos del registro.
  - Genera un formulario similar al de ADD pero con reglas de `EDIT`.
- Validaciones:
  - Iguales que en ADD pero con las reglas específicas de EDIT.
- Si todo es válido:
  - Se actualiza el registro (simulado o vía backend futuro).

### 4.8. Tests de IU / Datos

- Desde la zona de gestión se ofrecen iconos tipo:
  - “Tests IU”.
  - “Tests Datos”.
- Al pulsarlos, la app ejecuta baterías de tests:
  - Comprueba que para cada acción se generan los campos esperados.
  - Comprueba que las validaciones responden como se espera con datos válidos/erróneos.
- Muestra un resumen:
  - Tests pasados/fallidos.
  - Explicación de qué parte de la UI no cumple el estándar, si hay errores.

---

## 5. Arquitectura esperada (ficheros y responsabilidades)

> ⚠ Nota: esta sección mezcla lo que **ya existe** o se ha citado explícitamente, con lo que **se espera** que exista según los requisitos. No se inventan nombres nuevos; solo se recogen los descritos en el enunciado y en los errores reportados.

### 5.1. Ficheros de alto nivel

- `index.html`
  - Página principal de la aplicación.
  - Contiene:
    - Zona de cabecera, menú de entidades, banderas de idioma, contenedor para gestión de entidad y tabla de equipo.
    - Referencias a todos los JS (core, entidades, validaciones, idioma, datos de equipo, tests…).
- `IU.css`
  - Estilos para la interfaz: formularios, tablas, menús, mensajes de error, etc.
- `ET3_Datos_NombreEquipo.js`
  - Array `def_datos_NombreEquipo` con:
    - Entrega (p.ej. "ET3").
    - Nombre.
    - DNI.
    - Horas dedicadas.

### 5.2. Core de lógica y UI

- `Base/EntidadAbstracta.js` (o equivalente)
  - Clase base de las entidades.
  - Métodos comunes para ADD/EDIT/SEARCH/SHOWCURRENT, gestión de resultados, etc.
- `Core/GeneralUIManager.js`
  - Clase `UIManager` (o similar).
  - Responsabilidades:
    - Cargar una entidad al seleccionar una opción desde el menú.
    - Gestionar la acción actual (SEARCH, ADD, EDIT, SHOWCURRENT).
    - Coordinar la construcción de formularios/tablas (llamando a `DOMFormTableBuilder`).
    - Conectarse con sistema de validaciones.
    - Coordinar cambio de idioma.
- `Core/DOMFormTableBuilder.js`
  - Recibe estructura de entidad + acción.
  - Construye:
    - Formularios (inputs, selects, textareas, file, radio, checkbox…) según `attributes[...].html`.
    - Tablas de resultados a partir de colecciones de datos.
- `Core/Validations_Class.js`
  - Implementa funciones atómicas de validación:
    - `min_size`, `max_size`, `exp_reg`, reglas de ficheros (tamaño, tipo, nombre), fechas, etc.
  - Ofrece una capa superior para:
    - Validar un valor contra el conjunto de reglas `rules.validations[ACCION]`.
    - Devolver códigos de error que luego se traducen vía idioma.

### 5.3. Idiomas y textos

- `locale/idioma.js`
  - Control central del idioma activo.
- `app/Textos_ES.js`, `app/Textos_EN.js`
  - Definen diccionarios de claves → textos en ES/EN.
  - Incluyen:
    - Textos de menú.
    - Labels de campos.
    - Títulos de secciones.
    - Mensajes de error (por código).

### 5.4. Entidades y estructuras

- `app/persona_Class.js`
  - Clase concreta `persona` que:
    - Obtiene la estructura `estructura_persona`.
    - Implementa validaciones personalizadas (ej. DNI/NIE).
    - Actualmente genera parte de los formularios de forma manual.
- `estructura_persona` (objeto)
  - Define:
    - `entity: "persona"`.
    - `attributes`: cada atributo con:
      - Bloque `html` (tipo de campo, tamaño, opciones, etc.).
      - Bloque `rules.validations` por acción (ADD, EDIT, SEARCH, etc.), con reglas como `min_size`, `max_size`, `exp_reg`, etc.
- `app/entitiesConfig.js` (mencionado en el diseño)
  - Configuración de entidades disponibles.
  - Ejemplo:
    - `persona` (actual).
    - En el futuro: `producto`, `coche`, etc.

### 5.5. Acceso externo y tests

- `ExternalAccess_class.js` (previsto)
  - Encapsularía las llamadas a backend real (futuro).
- `Unit_Test_Class.js`
  - Define colecciones de tests (se han visto logs de ~35 tests).
  - Debe comprobar que:
    - La UI se construye correctamente según estructuras.
    - Las validaciones responden como se espera.

---

## 6. Reglas y restricciones importantes para agentes

Estas reglas vienen del enunciado de la entrega ET3 y deben respetarse siempre:

1. **No codificar formularios manualmente por entidad**  
   - El HTML de formularios y tablas se debe **generar dinámicamente** a partir de las estructuras de entidad.
   - Añadir una entidad no debe requerir añadir formularios fijos en HTML.

2. **No acoplar la UI a una sola entidad**  
   - Evitar cosas del tipo `if (entidad === "persona") { ... }` para generar UI.
   - En su lugar, usar la estructura genérica y bucles sobre los atributos.

3. **Validar todo lo que tenga reglas**  
   - Si un campo tiene `min_size` y `exp_reg`, hay que comprobar ambas reglas.
   - Debe existir validación por campo **y** validación global por acción.

4. **Multiidioma obligatorio (ES/EN)**  
   - No hardcodear textos visibles ni mensajes de error.
   - Todo debe pasar por el sistema de idioma (claves y diccionarios).

5. **Datos del equipo siempre dinámicos**  
   - No escribir nombres, DNI ni horas en HTML.
   - Siempre leer desde `ET3_Datos_NombreEquipo.js`.

6. **No usar librerías externas no autorizadas**  
   - No añadir jQuery, frameworks ni CDNs extra a menos que la asignatura lo permita explícitamente.
   - Mantener HTML/CSS/JS puro.

7. **Respetar nombres de ficheros y variables indicados**  
   - `index.html`, `IU.css`, `ET3_Datos_NombreEquipo.js`, etc.
   - Nombres de estructuras y variables pedidas en el enunciado.

---

## 7. Backlog de trabajo recomendado para agentes

Lista de tareas que los agentes pueden abordar, en orden lógico:

1. **Corregir el bug de `dni`**
   - Revisar `persona_Class.js`, función `personalize_dni_nie`.
   - Declarar la variable `dni` correctamente (o usar el valor pasado como parámetro).
   - Asegurarse de que no deja errores de consola al hacer ADD.

2. **Centralizar las validaciones personalizadas**
   - Crear un mecanismo (probablemente en `GeneralUIManager` o en el flujo de validación de campo) que:
     - Cuando un atributo tenga `personalized: true` en `rules.validations[ACCION]`:
       - Llame a `specialized_test_<atributo>(accion, valor)` en la entidad correspondiente.
     - Esto debe ocurrir tanto en la validación por campo como en la global.

3. **Implementar SEARCH completo con tabla de resultados**
   - Validar el formulario de búsqueda según la estructura.
   - Simular una búsqueda (datos dummy o capa de datos en memoria).
   - Usar `DOMFormTableBuilder` para pintar una tabla con resultados:
     - Cabeceras desde los atributos visibles.
     - Filas con iconos de acción (ver, editar).

4. **Migrar PERSONA al sistema genérico**
   - Reducir o eliminar la creación manual de formularios en `persona_Class.js`.
   - Hacer que el flujo para persona use los generadores genéricos (`DOMFormTableBuilder` + `Validations_Class` + estructuras) como cualquier entidad nueva.

5. **Añadir al menos 2–3 entidades nuevas**
   - Crear nuevas estructuras (p. ej. `estructura_producto`, `estructura_coche`, etc.).
   - Registrarlas en `entitiesConfig`.
   - Añadir textos de menú y labels en ES/EN.
   - Probar que funcionan **sin modificar el core**.

6. **Completar y sincronizar el multiidioma**
   - Verificar que todas las claves usadas en la UI existen en `Textos_ES` y `Textos_EN`.
   - Incluir mensajes de error traducidos (o con sufijo `-ES` / `-EN` si se usan códigos).

7. **Actualizar API.html**
   - Documentar:
     - Métodos clave de `UIManager` (carga de entidad, cambio de acción, etc.).
     - Funciones de `Validations_Class` (parámetros, comportamiento).
     - Funciones de `DOMFormTableBuilder` (cómo genera formularios y tablas).
     - Métodos de las entidades concretas (especialmente validaciones personalizadas).
   - Asegurar que API.html refleje el estado real del código.

---

## 8. Cómo deben trabajar los agentes sobre este repo

- **Leer primero este AGENTS.md** y, si existe, `README.md` y `API.html`.
- **Mantener el diseño genérico**:
  - Si se añade algo específico de una entidad, intentar que sea por configuración (estructura) y no por hardcode.
- **Preferir refactorización progresiva**:
  - No romper de golpe lo que ya está; migrar persona al sistema genérico paso a paso.
- **Dejar comentarios claros**:
  - Especialmente en puntos de validación, construcciones dinámicas y tests.
- **No introducir dependencias externas**:
  - Cualquier nueva funcionalidad debe ser implementada con JS nativo, a menos que las instrucciones de la asignatura indiquen lo contrario.

---

Fin del `AGENTS.md` para ET3.  
Este archivo debe mantenerse actualizado cada vez que se corrijan bugs importantes o se completen hitos del backlog.
