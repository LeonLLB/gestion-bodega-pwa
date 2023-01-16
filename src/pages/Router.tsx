import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Products from "./Products"
import TasaDolar from "./TasaDolar"


const BodegaRouter = () => {
  return (
    <Router>
      <Routes>          
        <Route path='/productos' element={<Products/>} />
        <Route path='/config' element={<TasaDolar/>}/>
        <Route path='*' element={<Navigate to='/productos' replace />} />
      </Routes>
    </Router>
  )
}

export default BodegaRouter