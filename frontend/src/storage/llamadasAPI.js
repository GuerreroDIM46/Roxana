import axios from 'axios'

const api = axios.create({
    baseURL: 'https://roxanaapitest.manabo.org/api/',
    maxBodyLength: Infinity,
    headers: {
        "Content-Type": "application/json"
    }
})

const API_LISTADOSSINPAGINACION = 'listados/search/listadosSinPaginacion'
const API_ELEMENTOSSINPAGINACION = 'elementos/search/elementosSinPaginacion'
const API_LISTADOS = 'listados'
const API_ELEMENTOS = 'elementos'
const API_ELEMENTOSPORLISTADO = 'elementos/search/elementosPorListado'

function llamadaAPI(method, body, path) {
    return api.request({
        method: method ?? "get",
        url: path,
        data: body
    })
}

export function getListados() {
    return llamadaAPI('get', null, API_LISTADOSSINPAGINACION)
}

export function getElementos() {
    return llamadaAPI('get', null, API_ELEMENTOSSINPAGINACION)
}

export function getElementosListado(listadoId) {
    return llamadaAPI('get', null, `${API_ELEMENTOSPORLISTADO}?listadoId=${listadoId}`)
}

export function postListado(listado) {
    return llamadaAPI('post', listado, API_LISTADOS)
}

export function postElemento(elemento) {
    return llamadaAPI('post', elemento, API_ELEMENTOS)
}

export function patchElemento(elemento) {
    return llamadaAPI('patch', elemento, `${API_ELEMENTOS}/${elemento.id}`)
}
