import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../componentes/Navbar";

interface Medicamento {
  id_medicamento: number;
  nombre_generico: string;
  precio_venta: number;
  unidades_por_caja: number;
}

interface Producto extends Medicamento {
  cantidad: number;
  subtotal: number;
}

const Ventas = () => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [mensaje, setMensaje] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/medicamentos")
      .then((response) => setMedicamentos(response.data))
      .catch((error) =>
        console.error("Error al obtener medicamentos:", error)
      );
  }, []);

  const handleAgregarProducto = (medicamento: Medicamento) => {
    const productoExistente = productos.find(
      (producto) => producto.id_medicamento === medicamento.id_medicamento
    );

    if (productoExistente) {
      const productosActualizados = productos.map((producto) => {
        if (producto.id_medicamento === medicamento.id_medicamento) {
          const nuevaCantidad = producto.cantidad + 1;
          return {
            ...producto,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * Number(producto.precio_venta),
          };
        }
        return producto;
      });

      setProductos(productosActualizados);
      actualizarTotal(productosActualizados);
    } else {
      const nuevoProducto: Producto = {
        ...medicamento,
        cantidad: 1,
        subtotal: Number(medicamento.precio_venta),
      };
      const nuevosProductos = [...productos, nuevoProducto];
      setProductos(nuevosProductos);
      actualizarTotal(nuevosProductos);
    }
  };

  const handleEliminarProducto = (id_medicamento: number) => {
    const productosActualizados = productos.filter(
      (producto) => producto.id_medicamento !== id_medicamento
    );
    setProductos(productosActualizados);
    actualizarTotal(productosActualizados);
  };

  const handleCantidadChange = (
    id_medicamento: number,
    nuevaCantidad: number
  ) => {
    if (nuevaCantidad <= 0) return;

    const productosActualizados = productos.map((producto) => {
      if (producto.id_medicamento === id_medicamento) {
        return {
          ...producto,
          cantidad: nuevaCantidad,
          subtotal: nuevaCantidad * Number(producto.precio_venta),
        };
      }
      return producto;
    });

    setProductos(productosActualizados);
    actualizarTotal(productosActualizados);
  };

  const actualizarTotal = (productosActualizados: Producto[]) => {
    const nuevoTotal = productosActualizados.reduce(
      (acc, producto) => acc + Number(producto.subtotal),
      0
    );
    setTotal(nuevoTotal);
  };

  const handleSubmit = async () => {
    if (productos.length === 0) {
      setMensaje("Agrega al menos un producto antes de guardar.");
      return;
    }

    // Cambié subtotal por precio_unitario aquí para cumplir validación backend
    const venta = {
      metodo_pago: "Efectivo",
      productos: productos.map((producto) => ({
        id_medicamento: producto.id_medicamento,
        cantidad: producto.cantidad,
        precio_unitario: Number(producto.precio_venta),
      })),
    };

    try {
      await axios.post("http://localhost:8000/api/ventas", venta);
      setMensaje("Venta guardada con éxito");
      setProductos([]);
      setTotal(0);
    } catch (error) {
      console.error("Error al guardar la venta:", error);
      setMensaje("Error al guardar la venta");
    }
  };

  const filteredMedicamentos = medicamentos.filter((medicamento) =>
    medicamento.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container-fluid mt-4">
        <h2 className="text-center mb-4">🛒 Carrito de Ventas</h2>

        {mensaje && (
          <div className="alert alert-info text-center">{mensaje}</div>
        )}

        <div className="row">
          {/* Medicamentos disponibles */}
          <div className="col-md-8">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Buscar medicamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <h4>🧪 Medicamentos Disponibles</h4>
            <div
              className="d-flex flex-wrap"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {filteredMedicamentos.map((med) => (
                <div
                  className="card m-2"
                  key={med.id_medicamento}
                  style={{ width: "15rem" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{med.nombre_generico}</h5>
                    <p className="card-text">
                      💵 {formatoMoneda.format(Number(med.precio_venta))} <br />
                      📦 {med.unidades_por_caja} unidades por caja
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleAgregarProducto(med)}
                    >
                      ➕ Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito de productos */}
          <div className="col-md-4">
            <h4>🧺 Carrito</h4>
            {productos.length === 0 ? (
              <p className="text-muted">No hay productos en el carrito.</p>
            ) : (
              <div className="list-group mb-3">
                {productos.map((producto) => (
                  <div
                    key={producto.id_medicamento}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div className="w-100">
                      <div className="fw-bold">{producto.nombre_generico}</div>
                      <div className="d-flex align-items-center mt-2">
                        <input
                          type="number"
                          className="form-control form-control-sm me-2"
                          style={{ width: "70px" }}
                          value={producto.cantidad}
                          min={1}
                          onChange={(e) =>
                            handleCantidadChange(
                              producto.id_medicamento,
                              parseInt(e.target.value)
                            )
                          }
                        />
                        <span className="me-auto">
                          Subtotal: {formatoMoneda.format(Number(producto.subtotal))}
                        </span>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleEliminarProducto(producto.id_medicamento)
                          }
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resumen de venta */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  🧾 Total: {formatoMoneda.format(Number(total))}
                </h5>

                <button className="btn btn-success w-100" onClick={handleSubmit}>
                  ✅ Finalizar Venta (Efectivo)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ventas;
