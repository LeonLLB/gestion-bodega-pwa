import { AlertColor, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField, } from "@mui/material"
import { FormEvent, useState } from "react"
import { db } from "../database/db"
import { ProductCore } from "../database/products"
import Alert from "./Alert"
import useSnackbar from "../hooks/useSnackbar"
import SimpleSnackbar from "./SimpleSnackbar"


interface ProductDeleteProps {
    id: number,
    isOpen: boolean,
    onClose: () => void,
}

const ProductDelete = ({
    id,
    isOpen,
    onClose,
}: ProductDeleteProps) => {


    
    const {snackbarData, setSnackbarState, resetSnackbar} = useSnackbar()

    const handleDelete = () => {
        db.productos.delete(id)
            .then(() => {
                setSnackbarState({
                    message: 'El producto fue eliminado con exito',
                    isOpen: true,
                    severity: 'success'
                })
                onClose()
            })
            .catch(() => {
                setSnackbarState({
                    message: 'No se pudo eliminar el producto',
                    isOpen: true,
                    severity: 'error'
                })
            })
    }

    return (
        <>
            <Dialog onClose={onClose} open={isOpen}>
                <DialogTitle>Eliminar producto</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Estas seguro de querer eliminar este producto? No se puede recuperar despues
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} variant="contained" color="error">Eliminar</Button>
                    <Button onClick={onClose} autoFocus variant="contained">Cancelar</Button>
                </DialogActions>                
            </Dialog>
            <SimpleSnackbar snackbarData={snackbarData} resetSnackbar={resetSnackbar}/>
        </>
    )
}

export default ProductDelete