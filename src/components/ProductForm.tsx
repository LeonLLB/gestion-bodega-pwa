import { AlertColor, Button, Dialog, DialogTitle, Snackbar, TextField, } from "@mui/material"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { db } from "../database/db"
import { ProductCore } from "../database/products"
import Alert from "./Alert"
import useSnackbar from "../hooks/useSnackbar"
import SimpleSnackbar from "./SimpleSnackbar"


interface ProductFormProps {
    isEdit: boolean,
    id?: number,
    isOpen: boolean,
    onClose: () => void,
}

const ProductForm = ({
    isEdit = false,
    id = undefined,
    isOpen,
    onClose,
}: ProductFormProps) => {

    const defFormState = {
        nombre: '',
        precioMayor: 0,
        precioUnitario: 0,
        cantidadPorPaca: 0
    }



    const [form, setForm] = useState<ProductCore>({ ...defFormState })
    const {snackbarData, setSnackbarState, resetSnackbar} = useSnackbar()

    const onInputChange = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>) => {
        if (name === 'nombre') {
            setForm({
                ...form,
                nombre: value
            })
            return
        }
        if (name === 'precioMayor') {
            setForm({
                ...form,
                precioMayor: +value,
                precioUnitario: +((+value / form.cantidadPorPaca).toFixed(2))
            })
            return
        }
        setForm({
            ...form,
            cantidadPorPaca: +value,
            precioUnitario: +((form.precioMayor / +value).toFixed(2))
        })
        return
    }

    const handleSubmit = (ev: FormEvent) => {
        ev.preventDefault()

        if (
            !form.nombre ||
            !form.precioMayor || form.precioMayor <= 0 ||
            !form.cantidadPorPaca || form.cantidadPorPaca <= 0 ||
            !form.precioUnitario || form.precioUnitario <= 0
        ) {
            setSnackbarState({
                isOpen: true,
                message: 'Uno de los campos no es valido',
                severity: 'error'
            })
            return
        }
        isEdit ? updateProduct() : createProduct()
    }

    const createProduct = () => {
        db.productos.add({ ...form })
        .then(() => {
            setSnackbarState({
                isOpen: true,
                message: 'Producto creado con exito',
                severity: 'success'
            })
            handleClose()
        })
        .catch((err) => {
            console.log(err)
            setSnackbarState({
                isOpen: true,
                message: 'No se pudo crear el producto',
                severity: 'error'
            })
        })
    }

    const updateProduct = () => {
        db.productos.update(id!,{ ...form })
        .then(() => {
            setSnackbarState({
                isOpen: true,
                message: 'Producto actualizado con exito',
                severity: 'success'
            })
            handleClose()
        })
        .catch((err) => {
            console.log(err)
            setSnackbarState({
                isOpen: true,
                message: 'No se pudo actualizar el producto',
                severity: 'error'
            })
        })
    }

    const handleClose = () => {
        onClose()
        setForm({ ...defFormState })
    }

    const prepare = () => {
        if(id){
            db.productos.get(id!).then(producto => {
                if (producto) {
                    setForm({
                        nombre: producto.nombre,
                        precioMayor: producto.precioMayor,
                        cantidadPorPaca: producto.cantidadPorPaca,
                        precioUnitario: producto.precioUnitario,
                    })
                    return
                }
                handleClose()
            })
        }
    }

    useEffect(prepare, [id])

    return (
        <>
            <Dialog onClose={handleClose} open={isOpen}>
                <DialogTitle>{isEdit ? 'Actualizar producto' : 'Añadir producto'}</DialogTitle>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridAutoColumns: 'minmax(0,2fr)', gap: '1rem', padding: '2rem' }}>
                    <TextField onChange={onInputChange} value={form.nombre} name="nombre" id="nombre" label="Nombre del producto" variant="outlined" />
                    <TextField onChange={onInputChange} type="number" value={form.precioMayor} name="precioMayor" id="precioMayor" label="Precio al Mayor" variant="outlined" />
                    <TextField onChange={onInputChange} type="number" value={form.cantidadPorPaca} name="cantidadPorPaca" id="cantidadPorPaca" label="Cantidad por Mayor" variant="outlined" />
                    <TextField onChange={onInputChange} type="number" value={form.precioUnitario} disabled name="precioUnitario" id="precioUnitario" label="Precio Unitario" variant="outlined" />
                    <Button type="submit" variant="contained">{isEdit ? 'Actualizar producto' : 'Registrar producto'}</Button>
                </form>
            </Dialog>
            <SimpleSnackbar snackbarData={snackbarData} resetSnackbar={resetSnackbar}/>
        </>
    )
}

export default ProductForm