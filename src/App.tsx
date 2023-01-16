import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { createTheme } from "@mui/material/styles"
import Products from "./pages/Products"

const theme = createTheme()

function App() {

  return (  
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{marginTop:'1rem'}}>      
        <Products/>
      </div>
    </ThemeProvider>      
  )
}

export default App
