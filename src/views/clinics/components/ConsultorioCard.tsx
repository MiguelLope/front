type ConsultorioCardProps = {
    id_consultorio: number;
    nombre: string;
    ubicacion: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

const ConsultorioCard = ({ id_consultorio, nombre, ubicacion, onEdit, onDelete }: ConsultorioCardProps) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card shadow-sm" style={{ borderRadius: '8px' }}>
                <div className="card-body">
                    <h5 className="card-title">{nombre}</h5>
                    <p className="card-text">Ubicación: {ubicacion}</p>
                    <div className="d-flex justify-content-between">
                        <button
                            className="btn"
                            style={{ backgroundColor: '#00796b', color: 'white' }}
                            onClick={() => onEdit(id_consultorio)}
                        >
                            Editar
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => onDelete(id_consultorio)}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultorioCard;
