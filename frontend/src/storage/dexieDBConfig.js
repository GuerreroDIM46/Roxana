import Dexie from 'dexie'

export const db = new Dexie('AppDB') 

db.version(1).stores({
  listados: 'id, nombre, tipo, flag', 
  elementos: 'id, nombre, barcode, estado, listadoId, flag'
})