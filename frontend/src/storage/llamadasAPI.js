import axios from 'axios'

const host = 'https://roxanaapitest.manabo.org/api/'

const API_LISTADOSSINPAGINACION = host + 'listados/search/listadosSinPaginacion'
const API_ELEMENTOSSINPAGINACION = host + 'elementos/search/elementosSinPaginacion'
const API_LISTADOS = host + 'listados'
const API_ELEMENTOS = host + 'elementos'
const API_ELEMENTOSPORLISTADO = host + 'elementos/search/elementosPorListado'


function llamadaAPI(method, body, path) {
    let config = {
        method: method ?? "get",
        maxBodyLength: Infinity,
        url: path,
        headers: {}
    }
    if (body) {
        config.data = body
        config.headers["Content-Type"] = "application/json"
    }
    return axios.request(config)
}

export function getListados() {
    return llamadaAPI('get', null, API_LISTADOSSINPAGINACION)
}

export function getElementos() {
    return llamadaAPI('get', null, API_ELEMENTOSSINPAGINACION)
}

export function getElementosListado(listado) {
    const url = `${API_ELEMENTOSPORLISTADO}?listadoId=${listado}`
    return llamadaAPI('get', null, url)
}

export function postListado(listado) {
    return llamadaAPI('post', listado, API_LISTADOS)
}

export function postElemento(elemento) {
    return llamadaAPI('post', elemento, API_ELEMENTOS)
}

export function patchElemento(elemento) {
    const url = `${API_ELEMENTOS}/${elemento.id}`
    return llamadaAPI('patch', elemento, url)
}

