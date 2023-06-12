import { AlertColor } from "@mui/material"
import { useState } from "react"

export interface SnackbarData { message: string, isOpen: boolean, severity: AlertColor | undefined }

const useSnackbar = () => {

    const defSnackbarState = {
        message: '',
        isOpen: false,
        severity: undefined
    }

    const [snackbarData, setSnackbarData] = useState<SnackbarData>({ ...defSnackbarState })

    const resetSnackbar = () => setSnackbarData({...defSnackbarState})

    const setSnackbarState = (newSnackbarData:SnackbarData) => {setSnackbarData({...newSnackbarData})}

    return {snackbarData,setSnackbarState,resetSnackbar}
}

export default useSnackbar