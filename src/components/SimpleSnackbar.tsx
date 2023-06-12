import { Alert, Snackbar } from "@mui/material"
import useSnackbar, { SnackbarData } from "../hooks/useSnackbar"
import { FC } from "react"




const SimpleSnackbar:FC<{snackbarData:SnackbarData,resetSnackbar:()=>void}> = ({snackbarData,resetSnackbar}) => {

  return (
    <Snackbar open={snackbarData.isOpen} onClose={() => resetSnackbar()} autoHideDuration={6000}>
        <Alert severity={snackbarData.severity} sx={{ width: '100%' }}>
            {snackbarData.message}
        </Alert>
    </Snackbar>
  )
}

export default SimpleSnackbar