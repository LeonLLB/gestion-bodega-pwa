

export interface ProductCore {
    nombre: string,
    precioMayor: number,
    precioUnitario: number,
    cantidadPorPaca: number,
}

export interface Product extends ProductCore{
    id?:number,    
}