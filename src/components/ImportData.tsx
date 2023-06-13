import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { MuiFileInput } from "mui-file-input"
import { useRef, useState } from "react"
import Alert from "./Alert"
import useSnackbar from "../hooks/useSnackbar"
import SimpleSnackbar from "./SimpleSnackbar"
import { Product } from "../database/products"
import { db } from "../database/db"


interface ImportDataProps {
    isOpen: boolean,
    onClose: () => void,
}

const ImportData = ({
    isOpen,
    onClose,
}: ImportDataProps) => {
    
    const {snackbarData, setSnackbarState, resetSnackbar} = useSnackbar()
    const [file,setFile] = useState<File | null>( null )

    const handleImport = async () => {

        const fileTypeError = {
            isOpen:true,
            message:'No ha insertado un archivo CSV valido',
            severity:'error'
        }

        if(!file || file.type !== 'text/csv') {
            setSnackbarState(fileTypeError as any)
            return
        }

        const fd = new FormData()

        fd.append('file',file)

        setSnackbarState({
            isOpen:true,
            message:'Recuperando los datos del CSV...',
            severity:'info'
        })

        const res = await fetch('https://csv-parser-api.onrender.com/import',{
            method:'POST',
            body:fd,
        })

        setSnackbarState({
            isOpen:true,
            message:'Datos obtenidos, validando...',
            severity:'info'
        })

        const data: Partial<Product>[] = await res.json()

        if(!data || data.length === 0){
            setSnackbarState({
                isOpen:true,
                message:'No hay datos en este CSV, abortando',
                severity:'info'
            })
            onClose()
        }

        const newProducts: Product[] = []

        for (const product of data) {
            if(!product.nombre || product.nombre === '') continue
            if(!product.precioMayor || product.precioMayor < 0 || isNaN(product.precioMayor)) continue
            if(!product.precioUnitario || product.precioUnitario < 0 || isNaN(product.precioUnitario)) continue
            if(!product.cantidadPorPaca || product.cantidadPorPaca < 0 || isNaN(product.cantidadPorPaca)) continue
            if(!product.id || product.id < 0 || isNaN(product.id)) continue
            newProducts.push(product as any)
        }

        const registrosNoValidos = data.length - newProducts.length
        const registrosValidos = newProducts.length

        const idList = (await db.productos.toArray())
            .map(product=>product.id)

        setSnackbarState({
            isOpen:true,
            message:'Reemplazando datos...',
            severity:'info'
        })

        await db.productos.bulkDelete(idList as any)

        await db.productos.bulkAdd(newProducts)

        setSnackbarState({
            isOpen:true,
            message:`Base de datos reemplazada, ${registrosNoValidos} registros no validos - ${registrosValidos} registros validos`,
            severity: "success"
,       })
        onClose()
    }

    return (
        <>
            <Dialog onClose={onClose} open={isOpen}>
                <DialogTitle>Importar Datos</DialogTitle>
                <DialogContent>
                    <MuiFileInput value={file} onChange={(ev)=>setFile(ev)}/> 
                    <DialogContentText id="alert-dialog-description">
                        Estas seguro de querer importar los datos de este archivo? Toda la información será remplazada con la del archivo CSV, solo si es valido
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleImport} variant="contained" color="error">Importar Datos</Button>
                    <Button onClick={onClose} autoFocus variant="contained">Cancelar</Button>
                </DialogActions>                
            </Dialog>
            <SimpleSnackbar snackbarData={snackbarData} resetSnackbar={resetSnackbar}/>
        </>
    )
}

export default ImportData