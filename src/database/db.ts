import Dexie, {Table} from 'dexie'
import { Product } from './products'

export class GestionBodegaDB extends Dexie{
    productos!: Table<Product,number>

    constructor(){
        super('GestionBodegaDB')
        this.version(4).stores({
            productos: '++id, nombre'
        })
    }
}

export const db = new GestionBodegaDB()