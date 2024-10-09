# Documentación de la API

## Introducción

Esta API proporciona acceso a la aplicación **Roxana** para la gestión de operaciones modulares, como la creación de listados, actualización de elementos y sincronización. A continuación, se detallan los endpoints disponibles, junto con ejemplos de solicitudes y respuestas, así como posibles errores y detalles de autenticación si es necesario.

## URL Base

https://roxana-b51eb4c4afbd.herokuapp.com/api

## Endpoints

### 1. **Listados** - Gestión de Listados

#### **GET** `/listados/search/listadosSinPaginacion`

Obtiene todos los `listados` sin paginación.

##### Ejemplo de Solicitud
```GET /listados/search/listadosSinPaginacion```

##### Ejemplo de respuesta

    {
    "_embedded": {
        "listados": [
        {
            "nombre": "XYZ123-45678-ABC",
            "id": 101,
            "_links": {
                "self": {
                    "href": "https://api.ejemplo.com/api/listados/101"
                },
                "listado": {
                    "href": "https://api.ejemplo.com/api/listados/101"
                },
                "elementos": {
                    "href": "https://api.ejemplo.com/api/listados/101/elementos"
                }
            }
        },
        {
            "nombre": "DEF456-78901-GHI",
            "id": 102,
            "_links": {
                "self": {
                    "href": "https://api.ejemplo.com/api/listados/102"
                },
                "listado": {
                    "href": "https://api.ejemplo.com/api/listados/102"
                },
                "elementos": {
                    "href": "https://api.ejemplo.com/api/listados/102/elementos"
                }
            }
        }
        ]
    }
    }




#### **POST** `/listados`

Crea un nuevo listado.

##### Ejemplo de Solicitud
```POST /listados```

##### Cuerpo de la Solicitud (JSON)

{
    "nombre": "Nuevo Listado",
}

### 2. Elementos - Gestión de Elementos

#### **GET** `/elementos/search/elementosSinPaginacion`

Obtiene todos los `elementos` sin paginación.

##### Ejemplo de Solicitud
```GET /elementos/search/elementosSinPaginacion```

##### Ejemplo de respuesta

    {
        "_embedded": {
            "elementos": [
            {
                "nombre": "Tubo de acero 25mm",
                "barcode": "112233445566",
                "estado": "200",
                "id": 101,
                "listadoId": 501,
                "_links": {
                    "self": {
                        "href": "https://api.ejemplo.com/api/elementos/101"
                    },
                    "elemento": {
                        "href": "https://api.ejemplo.com/api/elementos/101"
                    },
                    "listado": {
                        "href": "https://api.ejemplo.com/api/elementos/101/listado"
                    }
                }
            },
            {
                "nombre": "Válvula de presión 15 psi",
                "barcode": "998877665544",
                "estado": "300",
                "id": 102,
                "listadoId": 502,
                "_links": {
                    "self": {
                        "href": "https://api.ejemplo.com/api/elementos/102"
                    },
                    "elemento": {
                        "href": "https://api.ejemplo.com/api/elementos/102"
                    },
                    "listado": {
                        "href": "https://api.ejemplo.com/api/elementos/102/listado"
                    }
                }
            }]            
        }
    }


#### **POST ** `/elementos`

Crea un nuevo elemento.

##### Ejemplo de Solicitud

```POST /elementos```

##### Cuerpo de la Solicitud (JSON)

    {
        "nombre": "Elemento 3",
        "barcode": "1112223334445",
        "estado": "300",
        "listado": "https://api.ejemplo.com/api/listados/1"
    }


#### **PATCH ** `/elementos/{id}`

Actualiza un elemento existente.

##### Ejemplo de Solicitud

```PATCH /elementos/1```

##### Cuerpo de la Solicitud (JSON)

    {
        "nombre": "Elemento 1 Actualizado",
        "estado": "200",
    }