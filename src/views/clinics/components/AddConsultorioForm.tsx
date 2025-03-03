import { useState } from 'react';
import axios from 'axios';

type Consultorio = {
    id_consultorio: number;
    nombre: string;
    ubicacion: string;
};

interface AddConsultorioFormProps {
    showModal: boolean;
    onClose: () => void;
    onAdd: (newConsultorio: Consultorio) => void;
}

const AddConsultorioForm = ({ showModal, onClose, onAdd }: AddConsultorioFormProps) => {
    const [newConsultorio, setNewConsultorio] = useState<Consultorio>({id_consultorio: 0, nombre: '', ubicacion: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewConsultorio({ ...newConsultorio, [name]: value });
    };

    const handleSubmit = () => {
        if (!newConsultorio.nombre.trim() || !newConsultorio.ubicacion.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        axios.post('https://back-production-47e5.up.railway.app/api/consultorios', newConsultorio)
            .then((response) => {
                // La respuesta del servidor debe incluir el id_consultorio
                const savedConsultorio = response.data;
                onAdd(savedConsultorio); // Pasamos el objeto con id_consultorio a onAdd
                onClose(); // Cerrar el modal
                setNewConsultorio({id_consultorio: 0, nombre: '', ubicacion: '' }); // Limpiar los campos
            })
            .catch((error) => {
                console.error('Error al agregar consultorio:', error);
                setError('Ocurrió un error al guardar el consultorio. Por favor, inténtalo de nuevo.');
            })
            .finally(() => setIsSubmitting(false));
    };

    if (!showModal) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header" style={{ backgroundColor: '#00796b', color: '#fff' }}>
                        <h5 className="modal-title">Agregar Consultorio</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Cerrar"
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                fontSize: '1.5rem',
                            }}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                name="nombre"
                                value={newConsultorio.nombre}
                                onChange={handleInputChange}
                                aria-label="Nombre del consultorio"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ubicacion">Ubicación</label>
                            <textarea
                                className="form-control"
                                id="ubicacion"
                                name="ubicacion"
                                value={newConsultorio.ubicacion}
                                onChange={handleInputChange}
                                rows={3}
                                aria-label="Ubicación del consultorio"
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            style={{ backgroundColor: '#6c757d' }}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            style={{ backgroundColor: '#00796b' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Consultorio'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddConsultorioForm;
