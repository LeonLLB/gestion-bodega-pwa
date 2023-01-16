

export interface ProductCore {
    nombre: string,
    precioMayor: number,
    precioUnitario: number,
}

export interface Product extends ProductCore{
    id?:number,    
}