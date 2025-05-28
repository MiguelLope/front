import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../componentes/Navbar";

interface Medicamento {
    id_medicamento: number;
    nombre_generico: string;
    nombre_medico: string;
    fabricante: string;
    contenido: string;
    forma_farmaceutica: string;
    presentacion: string;
    unidades_por_caja: number;
    precio_compra: number;
    precio_venta: number;
}

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [filtered, setFiltered] = useState<Medicamento[]>([]);
    const [search, setSearch] = useState("");
    const [show, setShow] = useState(false);
    const [errorUnidades, setErrorUnidades] = useState("");

    const [form, setForm] = useState<Medicamento>({
        id_medicamento: 0,
        nombre_generico: "",
        nombre_medico: "",
        fabricante: "",
        contenido: "",
        forma_farmaceutica: "",
        presentacion: "",
        unidades_por_caja: 0,
        precio_compra: 0,
        precio_venta: 0,
    });

    useEffect(() => {
        fetchMedicamentos();
    }, []);

    const fetchMedicamentos = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/medicamentos");
            setMedicamentos(res.data);
            setFiltered(res.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFiltered(medicamentos.filter((m) =>
            m.nombre_generico.toLowerCase().includes(value)
        ));
    };

    const handleShow = (med?: Medicamento) => {
        setForm(med || {
            id_medicamento: 0,
            nombre_generico: "",
            nombre_medico: "",
            fabricante: "",
            contenido: "",
            forma_farmaceutica: "",
            presentacion: "",
            unidades_por_caja: 0,
            precio_compra: 0,
            precio_venta: 0,
        });
        setErrorUnidades("");
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (form.id_medicamento) {
                await axios.put(`http://localhost:8000/api/medicamentos/${form.id_medicamento}`, form);
            } else {
                await axios.post("http://localhost:8000/api/medicamentos", form);
            }
            fetchMedicamentos();
            handleClose();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8000/api/medicamentos/${id}`);
            fetchMedicamentos();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>Medicamentos</h2>
                    <button onClick={() => handleShow()} style={{ background: "#007bff", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "5px" }}>+ Nuevo</button>
                </div>

                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre genérico..."
                    style={{ width: "100%", marginTop: "1rem", padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
                    {filtered.map((med) => (
                        <div key={med.id_medicamento} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", boxShadow: "2px 2px 5px rgba(0,0,0,0.1)" }}>
                            <h4>{med.nombre_generico}</h4>
                            <p><strong>Médico:</strong> {med.nombre_medico}</p>
                            <p><strong>Fabricante:</strong> {med.fabricante}</p>
                            <p><strong>Contenido:</strong> {med.contenido}</p>
                            <p><strong>Forma:</strong> {med.forma_farmaceutica}</p>
                            <p><strong>Presentación:</strong> {med.presentacion}</p>
                            <p><strong>Unidades:</strong> {med.unidades_por_caja} {med.unidades_por_caja < 15 && <span style={{ color: "red" }}>⚠️ Bajo stock</span>}</p>
                            <p><strong>Compra:</strong> ${med.precio_compra}</p>
                            <p><strong>Venta:</strong> ${med.precio_venta}</p>
                            <div style={{ marginTop: "1rem" }}>
                                <button onClick={() => handleShow(med)} style={{ marginRight: "0.5rem" }}>Editar</button>
                                <button onClick={() => handleDelete(med.id_medicamento)} style={{ background: "red", color: "white" }}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>

                {show && (
                    <div style={{
                        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                        background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
                    }}>
                        <div style={{
                            background: "white", padding: "2rem", borderRadius: "10px", width: "90%", maxWidth: "600px"
                        }}>
                            <h3>{form.id_medicamento ? "Editar" : "Nuevo"} Medicamento</h3>

                            {["nombre_generico", "nombre_medico", "fabricante", "contenido", "forma_farmaceutica", "presentacion"].map((field) => (
                                <input
                                    key={field}
                                    type="text"
                                    name={field}
                                    value={(form as any)[field]}
                                    onChange={handleChange}
                                    placeholder={field.replace("_", " ")}
                                    style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
                                />
                            ))}

                            <input
                                type="number"
                                name="unidades_por_caja"
                                value={form.unidades_por_caja || ""}
                                min={0}
                                max={50}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value > 50) {
                                        setErrorUnidades("Máximo 50 unidades.");
                                        setForm({ ...form, unidades_por_caja: 50 });
                                    } else {
                                        setErrorUnidades("");
                                        setForm({ ...form, unidades_por_caja: value });
                                    }
                                }}
                                placeholder="Unidades por caja"
                                style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
                            />
                            {errorUnidades && <p style={{ color: "red" }}>{errorUnidades}</p>}

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <input
                                    type="number"
                                    name="precio_compra"
                                    value={form.precio_compra || ""}
                                    onChange={handleChange}
                                    placeholder="Precio de compra"
                                    style={{ flex: 1, padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
                                />
                                <input
                                    type="number"
                                    name="precio_venta"
                                    value={form.precio_venta || ""}
                                    onChange={handleChange}
                                    placeholder="Precio de venta"
                                    style={{ flex: 1, padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", gap: "1rem" }}>
                                <button onClick={handleSubmit} style={{ background: "#007bff", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "5px" }}>Guardar</button>
                                <button onClick={handleClose} style={{ background: "#ccc", padding: "0.5rem 1rem", border: "none", borderRadius: "5px" }}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Medicamentos;
