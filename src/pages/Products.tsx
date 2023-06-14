import { Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useLiveQuery } from "dexie-react-hooks"
import {  useState } from "react"
import {saveAs} from 'file-saver'
import { db } from "../database/db"
import ProductForm from "../components/ProductForm"
import TasaDolar from "../components/TasaDolar"
import { Delete, Edit } from "@mui/icons-material"
import ProductDelete from "../components/ProductDelete"
import ImportData from "../components/ImportData"
import useSnackbar from "../hooks/useSnackbar"
import SimpleSnackbar from "../components/SimpleSnackbar"

const Products = () => {

    const [query, setQuery] = useState('')
    const [id, setId] = useState<undefined | number>(undefined)

    const [dialogStatus,setDialogStatus] = useState({
        form:false,
        tasa:false,
        delete:false,
        import:false
    })

    const [tasaDolar,setTasaDolar] = useState(+(localStorage.getItem('tasa') || 0))

    const {snackbarData,setSnackbarState,resetSnackbar} = useSnackbar()

    const productQuery = async () => {
        
        const dataOfProductos = await db.productos.toArray()

        if (query === '') return dataOfProductos

        const condition = new RegExp(query,'i')
    
        const filterProductos = dataOfProductos.filter((producto)=>condition.test(producto.nombre))
        
        return filterProductos
    }

    const productos = useLiveQuery(productQuery,[query])

    const beginProductUpdate = (idToSelect:number) => {
        setId(idToSelect)
        setDialogStatus({...dialogStatus,form:true})
    }

    const beginProductDelete = (idToSelect:number) => {
        setId(idToSelect)
        setDialogStatus({...dialogStatus,delete:true})
    }

    const generateBackup = async () => {
        setSnackbarState({
            isOpen:true,
            message:'Generando respaldo de datos...',
            severity: 'info'
        })

        const data = await db.productos.toArray()

        const res = await fetch('https://csv-parser-api.onrender.com/export',{
            method:'POST',
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }
        })

        if(res.status >= 202){
            return setSnackbarState({
                isOpen:true,
                message:'No se pudo generar el respaldo de los datos',
                severity:'error'
            })
        }

        const blob = await res.blob()

        const date = new Date()
        const randomNumber = Math.random() * 100;

        setSnackbarState({
            isOpen:true,
            message:'CSV generado con exito!',
            severity:'success'
        })

        saveAs(blob,`Bodegon-Respaldo-${date.getDate()}${date.getMonth()+1}${date.getFullYear()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${randomNumber.toFixed(0)}`)
    }

    return (
        <>
            <Container>
                <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Button onClick={() => setDialogStatus({...dialogStatus,form:true})} variant="contained">Añadir producto</Button>
                    <TextField placeholder="Buscar producto..." type="search" value={query} onChange={({target:{value}})=>setQuery(value)} variant="outlined" />
                    <Button onClick={() => setDialogStatus({...dialogStatus,tasa:true})} variant="contained">Cambiar tasa del dolar</Button>
                </Container>
                <Container style={{ marginTop:'1rem',display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    Tasa del dolar: {tasaDolar} Bs
                    
                    <Button onClick={() => setDialogStatus({...dialogStatus,import:true})} variant="contained">Exportar Data</Button>
                    <Button onClick={() => generateBackup()} variant="contained">Importar Data</Button>
                </Container>
                <Container style={{marginTop:'1rem'}}>
                    <TableContainer style={{maxHeight:'20rem'}} component={Paper}>
                        <Table>
                            <TableBody>
                                {(productos && productos.length >0 ) && productos.map(producto => (
                                    <TableRow
                                        key={producto.id}
                                    >
                                        <TableCell component="th" scope="row" style={{fontWeight:'bold',fontSize:'1rem'}}>
                                            {producto.nombre}
                                        </TableCell>
                                        <TableCell align="right" style={{fontSize:'1rem'}}>{producto.precioUnitario} $</TableCell>
                                        <TableCell align="right" style={{fontSize:'1rem'}}>{(producto.precioUnitario * tasaDolar).toFixed(2)} Bs</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={()=>beginProductUpdate(producto.id!)}>
                                                <Edit></Edit>
                                            </IconButton>
                                            <IconButton onClick={()=>beginProductDelete(producto.id!)}>
                                                <Delete></Delete>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Container>
            <Container style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:'.5rem'}}>
                <span>Bodegón PWA v1.1</span>                
            </Container>
            <ProductForm id={id} isOpen={dialogStatus.form} onClose={() => {setDialogStatus({...dialogStatus,form:false});setId(undefined);}} isEdit={!!id}></ProductForm>
            <ProductDelete id={id!} isOpen={dialogStatus.delete} onClose={() => {setDialogStatus({...dialogStatus,delete:false});setId(undefined);}}></ProductDelete>
            <TasaDolar emitSuccessChange={(tasa)=>setTasaDolar(tasa)} isOpen={dialogStatus.tasa} onClose={() => setDialogStatus({...dialogStatus,tasa:false})} ></TasaDolar>
            <ImportData isOpen={dialogStatus.import} onClose={()=>setDialogStatus({...dialogStatus,import:false})}/>
            <SimpleSnackbar resetSnackbar={resetSnackbar} snackbarData={snackbarData}/>
        </>
    )
}

export default Products