import { useState, useEffect } from 'react';
import axios from 'axios';
import ConsultorioCard from './components/ConsultorioCard';
import NavBar from "../components/NavBar";
import EditConsultorioForm from './components/EditConsultorioForm';
import { ConfirmDialog } from '../components/Dialog';
import AddConsultorioForm from './components/AddConsultorioForm';

type Consultorio = {
    id_consultorio: number;
    nombre: string;
    ubicacion: string;
};

const ConsultorioPage = () => {
    const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [editConsultorioId, setEditConsultorioId] = useState<number | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [consultorioToDelete, setConsultorioToDelete] = useState<number | null>(null);

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/api/consultorios')
            .then((response) => {
                setConsultorios(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los consultorios:', error);
            });
    }, []);

    const filteredConsultorios = consultorios.filter((consultorio) =>
        (consultorio.nombre?.toLowerCase().includes(search.toLowerCase()) || 
         consultorio.ubicacion?.toLowerCase().includes(search.toLowerCase()))
    );

    const handleEdit = (id: number) => {
        setEditConsultorioId(id);
        setShowModalEdit(true);
    };

    const handleSave = (updatedConsultorio: { nombre: string; ubicacion: string }) => {
        setConsultorios(consultorios.map((consultorio) =>
            consultorio.id_consultorio === editConsultorioId
                ? { ...consultorio, ...updatedConsultorio }
                : consultorio
        ));
        setShowModalEdit(false);
        setEditConsultorioId(null);
    };

    const handleDelete = (id: number) => {
        setConsultorioToDelete(id);
        setShowConfirmDialog(true);
    };

    const confirmDelete = () => {
        if (consultorioToDelete !== null) {
            axios
                .delete(`http://127.0.0.1:8000/api/consultorios/${consultorioToDelete}`)
                .then(() => {
                    setConsultorios(
                        consultorios.filter((consultorio) => consultorio.id_consultorio !== consultorioToDelete)
                    );
                    setShowConfirmDialog(false);
                    setConsultorioToDelete(null);
                })
                .catch((error) => {
                    console.error('Error al eliminar el consultorio:', error);
                });
        }
    };

    const cancelDelete = () => {
        setShowConfirmDialog(false);
        setConsultorioToDelete(null);
    };

    const handleAddConsultorio = (newConsultorio: Consultorio) => {
        setConsultorios([...consultorios, newConsultorio]);
        setShowModal(false);
    };

    return (
        <div>
            <NavBar select={"consultorios"} />
            <div className="container mt-4">
                <h1 className="text-center" style={{ color: '#00796b' }}>Consultorios</h1>
                <div className="d-flex mb-4">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Buscar consultorio..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ borderColor: '#00796b' }}
                    />
                    <button
                        className="btn"
                        style={{ backgroundColor: '#00796b', color: 'white' }}
                        onClick={() => setShowModal(true)}
                    >
                        Agregar Nuevo Consultorio
                    </button>
                </div>
                <div className="row">
                    {filteredConsultorios.map((consultorio) => (
                        <ConsultorioCard
                            key={consultorio.id_consultorio}
                            id_consultorio={consultorio.id_consultorio}
                            nombre={consultorio.nombre}
                            ubicacion={consultorio.ubicacion}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
                <AddConsultorioForm
                    showModal={showModal}
                    onClose={() => setShowModal(false)}
                    onAdd={handleAddConsultorio}
                />
                {editConsultorioId !== null && (
                    <EditConsultorioForm
                        id_consultorio={editConsultorioId}
                        showModal={showModalEdit}
                        onClose={() => setShowModalEdit(false)}
                        onSave={handleSave}
                    />
                )}
                <ConfirmDialog
                    isOpen={showConfirmDialog}
                    onCancel={cancelDelete}
                    onConfirm={confirmDelete}
                    title="Confirmar Eliminación"
                    message="¿Estás seguro de que deseas eliminar este consultorio?"
                />
            </div>
        </div>
    );
};

export default ConsultorioPage;
