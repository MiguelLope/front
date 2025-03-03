import { useState, useEffect } from 'react';
import axios from 'axios';

type EditConsultorioProps = {
    id_consultorio: number;
    showModal: boolean;
    onClose: () => void;
    onSave: (updatedConsultorio: { nombre: string; ubicacion: string }) => void;
};

const EditConsultorioForm = ({ id_consultorio, showModal, onClose, onSave }: EditConsultorioProps) => {
    const [consultorio, setConsultorio] = useState({ nombre: '', ubicacion: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id_consultorio && showModal) {
            axios.get(`https://back-production-47e5.up.railway.app/api/consultorios/${id_consultorio}`)
                .then((response) => {
                    setConsultorio(response.data);
                })
                .catch(() => {
                    setError('No se pudo cargar la información del consultorio.');
                });
        }
        return () => {
            setConsultorio({ nombre: '', ubicacion: '' }); // Limpiar al cerrar el modal
            setError(null);
        };
    }, [id_consultorio, showModal]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConsultorio({ ...consultorio, [name]: value });
    };

    const handleSubmit = () => {
        if (!consultorio.nombre.trim() || !consultorio.ubicacion.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        axios.put(`https://back-production-47e5.up.railway.app/api/consultorios/${id_consultorio}`, consultorio)
            .then((response) => {
                onSave(response.data);
                onClose();
            })
            .catch(() => {
                setError('Ocurrió un error al guardar los cambios. Inténtalo de nuevo.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (!showModal) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header" style={{ backgroundColor: '#00796b', color: 'white' }}>
                        <h5 className="modal-title">Editar Consultorio</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Cerrar"
                            onClick={onClose}
                            style={{ color: 'white' }}
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
                                value={consultorio.nombre}
                                onChange={handleInputChange}
                                style={{ borderColor: '#00796b' }}
                                aria-label="Nombre del consultorio"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ubicacion">Ubicación</label>
                            <input
                                type="text"
                                className="form-control"
                                id="ubicacion"
                                name="ubicacion"
                                value={consultorio.ubicacion}
                                onChange={handleInputChange}
                                style={{ borderColor: '#00796b' }}
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
                            style={{ backgroundColor: '#00796b', color: 'white' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditConsultorioForm;
