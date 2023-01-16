import { Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import { db } from "../database/db"
import ProductForm from "../components/ProductForm"
import TasaDolar from "../components/TasaDolar"
import { Delete, Edit } from "@mui/icons-material"

const Products = () => {

    const [query, setQuery] = useState('')
    const [id, setId] = useState<undefined | number>(undefined)
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
    const [isTasaDialogOpen, setIsTasaDialogOpen] = useState(false)
    const [tasaDolar,setTasaDolar] = useState(+(localStorage.getItem('tasa') || 0))

    const productos = useLiveQuery(() =>  query !== '' ? db.productos.where('nombre').startsWithIgnoreCase(query).toArray() : db.productos.toArray(),[query])

    const beginProductUpdate = (idToSelect:number) => {
        setId(idToSelect)
        setIsFormDialogOpen(true)
    }

    return (
        <>
            <Container>
                <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Button onClick={() => setIsFormDialogOpen(true)} variant="contained">Añadir producto</Button>
                    <Button onClick={() => setIsTasaDialogOpen(true)} variant="contained">Cambiar tasa del dolar</Button>
                </Container>
                <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop:'1rem' }}>
                    <TextField placeholder="Buscar producto..." type="search" value={query} onChange={({target:{value}})=>setQuery(value)} variant="outlined" />
                </Container>
                <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop:'1rem' }}>
                    Tasa del dolar: {tasaDolar} Bs
                </Container>
                <Container style={{marginTop:'1rem'}}>
                    <TableContainer component={Paper}>
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
                                            <IconButton>
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
            <ProductForm id={id} isOpen={isFormDialogOpen} onClose={() => {setIsFormDialogOpen(false);setId(undefined);}} isEdit={!!id}></ProductForm>
            <TasaDolar emitSuccessChange={(tasa)=>setTasaDolar(tasa)} isOpen={isTasaDialogOpen} onClose={() => setIsTasaDialogOpen(false)} ></TasaDolar>
        </>
    )
}

export default Products