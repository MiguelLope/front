type formData = {
  id_usuario?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  curp?: string;
  contraseña?: string;
  tipo_usuario?: string
};

type ModalProps = {
  title: string;
  formData: formData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setModalOpen: (isOpen: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;
};


export const FormAdministrators: React.FC<ModalProps> = ({ title, formData, handleChange, handleSubmit, setModalOpen, setFormData }) => {

  const closeForm=()=>{
    setFormData({ id_usuario: 0, nombre: '', email: '', telefono: '', curp: '', contraseña: '',tipo_usuario: 'admin', }); setModalOpen(false); 
  }

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeForm}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="curp" className="form-label">CURP</label>
                <input
                  type="text"
                  className="form-control"
                  id="curp"
                  name="curp"
                  value={formData.curp || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="contraseña" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="contraseña"
                  name="contraseña"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeForm}>Cerrar</button>
              <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};
