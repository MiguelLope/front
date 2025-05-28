import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Medicamentos from './views/medicamentos/Medicamentos'
import Ventas from "./views/ventas/Ventas";
import VentasDetalles from "./views/detalles/DetallesVentas";
import Consultas from "./views/consulta/Consultas";
import Reabastecimiento from "./views/almacen/Reabastecimiento";
import PedidosFarmacia from "./views/pedidos/Pedidos";
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/medicamentos" />} />
        </Routes>
        <Routes>
          <Route path="/medicamentos" Component={Medicamentos} />
        </Routes>
        <Routes>
          <Route path="/carrito" Component={Ventas} />
        </Routes>
        <Routes>
          <Route path="/histventas" Component={VentasDetalles} />
        </Routes>
        <Routes>
          <Route path="/farmacias" Component={Consultas} />
        </Routes>
        <Routes>
          <Route path="/bodega" Component={Reabastecimiento} />
        </Routes>
        <Routes>
          <Route path="/solicitudes" Component={PedidosFarmacia} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
