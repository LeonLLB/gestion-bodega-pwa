import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { createTheme } from "@mui/material/styles"
import BodegaRouter from "./pages/Router"

const theme = createTheme()

function App() {

  return (  
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{marginTop:'1rem'}}>      
        <BodegaRouter/>
      </div>
    </ThemeProvider>      
  )
}

export default App
