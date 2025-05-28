import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Navbar from "../componentes/Navbar";

interface Medicamento {
    id_medicamento: number;
    nombre_generico: string;
    contenido: string;
    forma_farmaceutica: string;
    unidades_por_caja: number;
    existencia_bodega: number;
}

type Mensaje = {
    texto: string;
    tipo: 'exito' | 'error' | 'info' | 'advertencia';
};

const UMBRAL_REABASTECIMIENTO = 15;
const STOCK_OBJETIVO = 50;

const Reabastecimiento = () => {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [carrito, setCarrito] = useState<{ id: number, cantidad: number }[]>([]);
    const [mensaje, setMensaje] = useState<Mensaje | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchMedicamentos = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/medicamentos/con-existencia");
                setMedicamentos(response.data);
            } catch (error) {
                setMensaje({
                    texto: "No se pudo cargar la lista de medicamentos.",
                    tipo: "error"
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchMedicamentos();
    }, []);

    const faltantes = useMemo(() =>
        medicamentos.filter(m => m.unidades_por_caja <= UMBRAL_REABASTECIMIENTO),
        [medicamentos]
    );

    const getMax = (med: Medicamento) => {
        const faltan = STOCK_OBJETIVO - med.unidades_por_caja;
        return faltan > 0 ? faltan : 0;
    };

    const agregarAlCarrito = (id: number) => {
        if (!carrito.some(item => item.id === id)) {
            setCarrito(prev => [...prev, { id, cantidad: 1 }]);
        }
    };

    const eliminarDelCarrito = (id: number) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    const actualizarCantidad = (id: number, nuevaCantidad: number, max: number) => {
        const cantidad = Math.max(1, Math.min(nuevaCantidad, max));
        setCarrito(prev =>
            prev.map(item =>
                item.id === id ? { ...item, cantidad } : item
            )
        );
    };

    const getMedicamento = (id: number) => medicamentos.find(m => m.id_medicamento === id);

    const enviarPedido = async () => {
        if (carrito.length === 0) {
            setMensaje({ texto: "El carrito está vacío.", tipo: "advertencia" });
            return;
        }

        try {
            setIsSubmitting(true);
            const datos = carrito.map(item => ({
                id: item.id.toString(),
                cantidad: item.cantidad
            }));

            await axios.post("http://localhost:8000/api/bodega", { medicamentos: datos });

            setMensaje({ texto: "Solicitud enviada exitosamente.", tipo: "exito" });
            setCarrito([]);
        } catch (err) {
            setMensaje({ texto: "Error al enviar la solicitud.", tipo: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="text-center mb-4">Reabastecimiento de Medicamentos</h2>

                {mensaje && (
                    <div className={`alert alert-${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" />
                        <p>Cargando medicamentos...</p>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-md-8">
                            <h4>Medicamentos con baja existencia</h4>
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Contenido</th>
                                        <th>Forma</th>
                                        <th>Existencia</th>
                                        <th>Bodega</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faltantes.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center text-success">
                                                Todos los medicamentos están en niveles aceptables.
                                            </td>
                                        </tr>
                                    ) : (
                                        faltantes.map(med => (
                                            <tr key={med.id_medicamento}>
                                                <td>{med.nombre_generico}</td>
                                                <td>{med.contenido}</td>
                                                <td>{med.forma_farmaceutica}</td>
                                                <td>{med.unidades_por_caja}</td>
                                                <td>{med.existencia_bodega}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => agregarAlCarrito(med.id_medicamento)}
                                                        disabled={carrito.some(item => item.id === med.id_medicamento)}
                                                    >
                                                        Agregar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="col-md-4">
                            <h4>Carrito</h4>
                            {carrito.length === 0 ? (
                                <p className="text-muted">Aún no has agregado medicamentos.</p>
                            ) : (
                                <ul className="list-group">
                                    {carrito.map(item => {
                                        const med = getMedicamento(item.id);
                                        if (!med) return null;
                                        const max = getMax(med);

                                        return (
                                            <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                                                <div style={{ width: "60%" }}>
                                                    <strong>{med.nombre_generico}</strong>
                                                    <br />
                                                    <small>Máx: {max}</small>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={item.cantidad}
                                                    min={1}
                                                    max={max}
                                                    className="form-control form-control-sm"
                                                    style={{ width: "60px" }}
                                                    onChange={e => actualizarCantidad(item.id, parseInt(e.target.value || "1"), max)}
                                                />
                                                <button className="btn btn-sm btn-danger ms-2" onClick={() => eliminarDelCarrito(item.id)}>X</button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            <button
                                className="btn btn-success mt-3 w-100"
                                onClick={enviarPedido}
                                disabled={isSubmitting || carrito.length === 0}
                            >
                                {isSubmitting ? "Enviando..." : "Enviar Pedido"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Reabastecimiento;
