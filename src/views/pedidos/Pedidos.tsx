import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../componentes/Navbar";

interface Medicamento {
    idMedicamento: string;
    nombre_generico: string;
    contenido: string;
    forma_farmacologica: string;
    presentacion: string;
}

interface DetallePedido {
    idMedicamento: string;
    Cantidades: number;
    Cumplen: boolean;
    medicamento: Medicamento;
}

interface Pedido {
    idPedido: number;
    PeticionValida: boolean;
    Pagado: boolean;
    Entregado: boolean;
    Finalizado: boolean;
    detalles: DetallePedido[];
}

const PedidosFarmacia = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8000/api/pedidos")
            .then(res => setPedidos(res.data))
            .catch(err => console.error("Error cargando pedidos:", err))
            .finally(() => setLoading(false));
    }, []);

    const marcarComoEntregado = async (idPedido: number) => {
        try {
            await axios.put(`http://localhost:8000/api/pedidos/${idPedido}/entregar`);
            const res = await axios.get("http://localhost:8000/api/pedidos");
            setPedidos(res.data);
        } catch (error) {
            console.error("Error al actualizar estado Entregado:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-5">
                <h2 className="mb-4 text-center">Solicitudes</h2>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2">Cargando pedidos...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="alert alert-warning text-center">No hay pedidos registrados.</div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {pedidos.map((pedido) => (
                            <div key={pedido.idPedido} style={{ border: '2px solid #ddd', padding: '20px', borderRadius: '12px', background: '#f9f9f9' }}>
                                <div className="d-flex justify-content-between align-items-start flex-wrap">
                                    <div>
                                        <h5 className="mb-1">📦 Pedido #{pedido.idPedido}</h5>
                                        <p className="mb-1">
                                            Estado:{" "}
                                            <span className={`fw-bold ${pedido.Finalizado ? 'text-success' : 'text-primary'}`}>
                                                {pedido.Finalizado ? "Finalizado" : "En proceso"}
                                            </span>
                                        </p>
                                        <p className="mb-1">
                                            Pago: {pedido.Pagado ? "✅ Pagado" : "❌ No pagado"}
                                        </p>
                                        <p className="mb-1">
                                            Entrega: {pedido.Entregado ? "🚚 Entregado" : "🕒 Pendiente"}
                                        </p>
                                    </div>

                                    {pedido.Pagado && !pedido.Entregado && (
                                        <button
                                            onClick={() => marcarComoEntregado(pedido.idPedido)}
                                            className="btn btn-outline-success mt-2"
                                        >
                                            Marcar como Entregado
                                        </button>
                                    )}
                                </div>

                                <hr />

                                <div className="table-responsive">
                                    <table className="table table-sm table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Medicamento</th>
                                                <th>Cantidad</th>
                                                <th>¿Cumple?</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.detalles.map((detalle) => (
                                                <tr key={detalle.idMedicamento}>
                                                    <td>{detalle.medicamento.nombre_generico}</td>
                                                    <td>{detalle.Cantidades}</td>
                                                    <td>
                                                        {detalle.Cumplen ? (
                                                            <span className="text-success">✔ Sí</span>
                                                        ) : (
                                                            <span className="text-danger">✘ No</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PedidosFarmacia;
