import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import { db } from "../database/db"
import { useNavigate } from 'react-router-dom'
import ProductForm from "../components/ProductForm"

const Products = () => {

    const [query, setQuery] = useState('')
    const [id, setId] = useState<undefined | number>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [tasaDolar] = useState(+(localStorage.getItem('tasa') || 0))

    const navigate = useNavigate()

    const productos = useLiveQuery(() =>  query !== '' ? db.productos.where('nombre').startsWithIgnoreCase(query).toArray() : db.productos.toArray(),[query])

    return (
        <>
            <Container>
                <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Button onClick={() => setIsDialogOpen(true)} variant="contained">Añadir producto</Button>
                    <Button variant="contained">Cambiar tasa del dolar</Button>
                </Container>
                <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop:'1rem' }}>
                    <TextField placeholder="Buscar producto..." type="search" value={query} onChange={({target:{value}})=>setQuery(value)} variant="outlined" />
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
                                        <TableCell align="right">{producto.precioUnitario} $</TableCell>
                                        <TableCell align="right">{producto.precioUnitario * tasaDolar} Bs</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Container>
            <ProductForm id={id} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} isEdit={!!id}></ProductForm>
        </>
    )
}

export default Products