import {  AlertColor, Button, Container, Dialog, DialogTitle, Snackbar, TextField, AlertProps } from "@mui/material"
import MuiAlert from "@mui/material/Alert"
import { ChangeEvent, FormEvent, forwardRef, useState } from "react"
import { db } from "../database/db"
import { ProductCore } from "../database/products"

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

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

    const defFormState = {
        nombre: '',
        precioMayor: 0,
        precioUnitario: 0,
        cantidadPorPaca: 0
    }

    const defSnackbarState = {
        message:'',
        isOpen:false,
        severity:undefined
    }

    const [form,setForm] = useState<ProductCore>({...defFormState})
    const [snackbarData, setSnackbarData] = useState<{message:string,isOpen:boolean,severity:AlertColor | undefined}>({...defSnackbarState})

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
        
        if(
            !form.nombre ||
            !form.precioMayor || form.precioMayor <= 0 ||
            !form.cantidadPorPaca || form.cantidadPorPaca <= 0 ||
            !form.precioUnitario || form.precioUnitario <= 0 
        ){
            setSnackbarData({
                isOpen:true,
                message:'El formulario no es valido',
                severity:'error'
            })
            return
        }
        db.productos.add({...form})
            .then(()=>{
                setSnackbarData({
                    isOpen:true,
                    message:'Producto creado con exito',
                    severity:'success'
                })
                handleClose()
            })    
            .catch((err)=>{
                console.log(err)
                setSnackbarData({
                    isOpen:true,
                    message:'No se pudo crear el producto',
                    severity:'error'
                })
            })        
        return        
    }

    const handleClose = () => {
        onClose()
        setForm({...defFormState})
    }

  return (
    <>    
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
        <Snackbar open={snackbarData.isOpen} onClose={()=>setSnackbarData({...defSnackbarState})} autoHideDuration={6000}>
            <Alert severity={snackbarData.severity} sx={{ width: '100%' }}>
                {snackbarData.message}
            </Alert>
        </Snackbar>
    </>
  )
}

export default ProductForm