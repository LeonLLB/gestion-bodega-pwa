import { AlertColor, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField, } from "@mui/material"
import { FormEvent, useState } from "react"
import { db } from "../database/db"
import { ProductCore } from "../database/products"
import Alert from "./Alert"


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


    const defSnackbarState = {
        message: '',
        isOpen: false,
        severity: undefined
    }

    const [snackbarData, setSnackbarData] = useState<{ message: string, isOpen: boolean, severity: AlertColor | undefined }>({ ...defSnackbarState })

    const handleDelete = () => {
        db.productos.delete(id)
            .then(() => {
                setSnackbarData({
                    message: 'El producto fue eliminado con exito',
                    isOpen: true,
                    severity: 'success'
                })
                onClose()
            })
            .catch(() => {
                setSnackbarData({
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
            <Snackbar open={snackbarData.isOpen} onClose={() => setSnackbarData({ ...defSnackbarState })} autoHideDuration={6000}>
                <Alert severity={snackbarData.severity} sx={{ width: '100%' }}>
                    {snackbarData.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default ProductDelete