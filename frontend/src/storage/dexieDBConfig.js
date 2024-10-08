// db.js (archivo de configuración de DexieDB)
import Dexie from 'dexie'

export const db = new Dexie('AppDB') // Crear una base de datos llamada "AppDB"

// Definir las tablas y esquemas
db.version(1).stores({
  listados: 'id, nombre, tipo, flag', // Agregar flag para los listados
  elementos: 'id, nombre, barcode, estado, listadoId, flag' // Agregar flag para los elementos
})