import { Button, Container, Dialog, DialogTitle, TextField } from "@mui/material"
import { ChangeEvent, FormEvent, useState } from "react"
import { ProductCore } from "../database/products"

interface ProductFormProps{
    isEdit: boolean,
    id?: number,
    isOpen: boolean,
    onClose: ()=>void,
}

const ProductForm = ({
    isEdit = false,
    id = undefined,
    isOpen,
    onClose,
}:ProductFormProps) => {

    const defState = {
        nombre: '',
        precioMayor: 0,
        precioUnitario: 0,
        cantidadPorPaca: 0
    }

    const [form,setForm] = useState<ProductCore>({...defState})

    const onInputChange = ({target:{value,name}}: ChangeEvent<HTMLInputElement>) => {
        if(name === 'nombre'){
            setForm({
                ...form,
                nombre:value
            })
            return
        }
        if(name === 'precioMayor'){
            setForm({
                ...form,
                precioMayor:+value,
                precioUnitario: +((+value / form.cantidadPorPaca).toFixed(2))
            })
            return
        }  
        setForm({
            ...form,
            cantidadPorPaca:+value,
            precioUnitario: +((form.precioMayor / +value).toFixed(2))
        })
        return    
    }

    const handleSubmit = (ev: FormEvent) => {
        ev.preventDefault()
        console.log(form)
    }

    const handleClose = () => {
        onClose()
        setForm({...defState})
    }

  return (
    <Dialog  onClose={handleClose} open={isOpen}>
        <DialogTitle>{ isEdit ? 'Actualizar producto' : 'Añadir producto' }</DialogTitle>
        <form onSubmit={handleSubmit} style={{display:'grid',gridAutoColumns:'minmax(0,2fr)',gap:'1rem', padding:'2rem'}}>
            <TextField onChange={onInputChange} value={form.nombre} name="nombre" id="nombre" label="Nombre del producto" variant="outlined" />
            <TextField onChange={onInputChange} type="number" value={form.precioMayor} name="precioMayor" id="precioMayor" label="Precio al Mayor" variant="outlined" />
            <TextField onChange={onInputChange} type="number" value={form.cantidadPorPaca} name="cantidadPorPaca" id="cantidadPorPaca" label="Cantidad por Mayor" variant="outlined" />
            <TextField onChange={onInputChange} type="number" value={form.precioUnitario} disabled name="precioUnitario" id="precioUnitario" label="Precio Unitario" variant="outlined" />
            <Button type="submit" variant="contained">Registrar producto</Button>
        </form>
    </Dialog>
  )
}

export default ProductForm