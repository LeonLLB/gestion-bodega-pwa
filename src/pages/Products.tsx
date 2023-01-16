import { Button, Container } from "@mui/material"
import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import { db } from "../database/db"
import {useNavigate} from 'react-router-dom'
import ProductForm from "../components/ProductForm"

const Products = () => {

    const [query,setQuery] = useState('')
    const [id,setId] = useState<undefined | number>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [tasaDolar] = useState(+(localStorage.getItem('tasa') || 0))

    const navigate = useNavigate()

    const clearQuery = () => setQuery('')

    const productos = useLiveQuery(()=>db.productos.where('nombre').anyOf(query).toArray())
    
    return (
        <>
            <Container>
                <Container style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                    <Button onClick={()=>setIsDialogOpen(true)} variant="contained">Añadir producto</Button>
                    <Button variant="contained">Cambiar tasa del dolar</Button>
                </Container>
            </Container>
            <ProductForm id={id} isOpen={isDialogOpen} onClose={()=>setIsDialogOpen(false)} isEdit={!!id}></ProductForm>
        </>
    )
}

export default Products