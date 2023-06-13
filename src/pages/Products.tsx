import { Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import { db } from "../database/db"
import ProductForm from "../components/ProductForm"
import TasaDolar from "../components/TasaDolar"
import { Delete, Edit } from "@mui/icons-material"
import ProductDelete from "../components/ProductDelete"
import ImportData from "../components/ImportData"

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
                    <Button onClick={() => null} variant="contained">Importar Data</Button>
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
        </>
    )
}

export default Products