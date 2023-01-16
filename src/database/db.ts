import Dexie, {Table} from 'dexie'
import { Product } from './products'

export class GestionBodegaDB extends Dexie{
    productos!: Table<Product,number>

    constructor(){
        super('GestionBodegaDB')
        this.version(3).stores({
            productos: '++id'
        })
    }
}

export const db = new GestionBodegaDB()