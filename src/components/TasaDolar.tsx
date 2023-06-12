import { AlertColor, Button, Container, Dialog, DialogTitle, Snackbar, TextField } from "@mui/material"
import { FormEvent, useState } from "react"
import Alert from "./Alert"
import useSnackbar from "../hooks/useSnackbar"
import SimpleSnackbar from "./SimpleSnackbar"


const TasaDolar = ({
  isOpen,
  onClose,
  emitSuccessChange
}: { isOpen: boolean, onClose: () => void, emitSuccessChange: (tasa:number)=>void}) => {

  const getPrimeraTasa = () => +(localStorage.getItem('tasa') || 0)
  const [tasaDolar, setTasaDolar] = useState(getPrimeraTasa())
  const {snackbarData, setSnackbarState, resetSnackbar} = useSnackbar()


  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    if(
      !tasaDolar || isNaN(tasaDolar) || tasaDolar < 0
    ){
        setSnackbarState({
          isOpen:true,
          message:'La tasa del dolar no es valida',
          severity:'error'
        })
        return
    }
    localStorage.setItem('tasa',tasaDolar.toString())
    emitSuccessChange(tasaDolar)
    setSnackbarState({
      message:'La tasa del dolar ha sido cambiada',
      isOpen:true,
      severity:'success'
    })
    onClose()
    return
  }

  return (
    <>
      <Dialog onClose={onClose} open={isOpen}>
        <DialogTitle>Actualizar la tasa del dolar</DialogTitle>
        <Container>
          Actualmente, la tasa del dolar usada para los calculos es de {getPrimeraTasa()} Bs
        </Container>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridAutoColumns: 'minmax(0,1fr)', gap: '1rem', padding: '2rem' }}>
          <TextField type="number" onChange={({ target: { value } }) => setTasaDolar(+value)} value={tasaDolar} name="Tasa" id="Tasa" label="Tasa del dolar actual" variant="outlined" />
          <Button type="submit" variant="contained">Actualizar tasa</Button>
        </form>
      </Dialog>
      <SimpleSnackbar resetSnackbar={resetSnackbar} snackbarData={snackbarData}/>
    </>
  )
}

export default TasaDolar