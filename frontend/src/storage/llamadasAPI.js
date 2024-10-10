import axios from 'axios'

export const host = 'https://roxana-b51eb4c4afbd.herokuapp.com/api/'

const API_LISTADOSSINPAGINACION = host + 'listados/listadosSinPaginacion'
const API_ELEMENTOSSINPAGINACION = host + 'elementos/elementosSinPaginacion'
const API_LISTADOS = host + 'listados'
const API_ELEMENTOS = host + 'elementos'



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

