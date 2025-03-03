import React, { useState, useEffect } from 'react';
import { FormEspecialista } from './components/FormSpecialists';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { ConfirmDialog, SuccessDialog } from '../components/Dialog';
import { useNavigate } from "react-router-dom";


type Especialista = {
  id_usuario: number;
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
  curp: string;
  contraseña: string;
  tipo_usuario: string;
};



const Especialista = () => {

  const navigate = useNavigate();
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [formData, setFormData] = useState<Partial<Especialista>>({
    id_usuario: 0,
    nombre: '',
    especialidad: '',
    email: '',
    telefono: '',
    curp: '',
    contraseña: '',
    tipo_usuario: 'especialista',
  });
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedEspecialista, setSelectedEspecialista] = useState<Especialista | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    axios
      .get('https://back-production-47e5.up.railway.app/api/especialistas')
      .then((response) => {
        setEspecialistas(response.data);
        console.log(response.data);

      })
      .catch((error) => {
        console.error('Error al obtener los Especialista:', error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id_usuario) {
      axios
        .put(`https://back-production-47e5.up.railway.app/api/usuarios/${formData.id_usuario}`, formData)
        .then((response) => {
          setEspecialistas((prev) =>
            prev.map((especialista) =>
              especialista.id_usuario === formData.id_usuario ? response.data : especialista
            )
          );
          setSuccessMessage('Especialista actualizado con éxito.');
          setSuccessDialogOpen(true);
        })
        .catch((error) => {
          console.error('Error al actualizar pspecialista:', error);
        });
    } else {
      axios
        .post('https://back-production-47e5.up.railway.app/api/usuarios', formData)
        .then((response) => {
          setEspecialistas((prev) => [...prev, response.data]);
          console.log(response.data);

          setSuccessMessage('Especialista agregado con éxito.');
          setSuccessDialogOpen(true);
        })
        .catch((error) => {
          console.error('Error al agregar especialista:', error);
        });
    }
    setModalOpen(false);
    setFormData({
      id_usuario: 0,
      nombre: '',
      especialidad: '',
      email: '',
      telefono: '',
      curp: '',
      contraseña: '',
      tipo_usuario: 'especialista',
    });
  };

  const handleEdit = (especialista: Especialista) => {
    setFormData(especialista);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (especialista: Especialista) => {
    setSelectedEspecialista(especialista);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEspecialista) {
      axios
        .delete(`https://back-production-47e5.up.railway.app/api/usuarios/${selectedEspecialista.id_usuario}`)
        .then(() => {
          setEspecialistas((prev) =>
            prev.filter((especialista) => especialista.id_usuario !== selectedEspecialista.id_usuario)
          );
          setSuccessMessage('Especialista eliminado con éxito.');
          setSuccessDialogOpen(true);
        })
        .catch((error) => {
          console.error('Error al eliminar el Especialista: ', error);
        });
    }
    setDialogOpen(false);
    setSelectedEspecialista(null);
  };

  const filtereEspecialistas = especialistas.filter(
    (especialista) =>
      especialista.nombre?.toLowerCase().includes(search.toLowerCase()) ?? false
  );
  


  const handleNavigationClick = (data: Especialista) => {
    const dataToSend = { data: data }; // Datos a enviar
    navigate('/admin/specialists/view', { state: dataToSend });  };

    return (
      <div>
        <NavBar select="usuarios" />
        <div className="container my-5">
          <h2 className="text-center mb-4">Especialista</h2>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
            <div className="d-flex w-100 mb-3 mb-sm-0">
              <input
                type="text"
                className="form-control me-2 w-100"
                placeholder="Buscar Especialista..."
                value={search}
                onChange={handleSearchChange}
              />
              <button
                className="btn btn-success ms-2 w-100 w-sm-auto"
                onClick={() => setModalOpen(true)}
              >
                Crear Especialista
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Contraseña</th>
                  <th>CURP</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtereEspecialistas.map((especialista) => (
                  <tr key={especialista.id_usuario}>
                    <td>{especialista.nombre}</td>
                    <td>{especialista.especialidad}</td>
                    <td>{especialista.email}</td>
                    <td>{especialista.telefono}</td>
                    <td>{'*'.repeat(8)}</td>
                    <td>{especialista.curp}</td>
                    <td>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleEdit(especialista)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleOpenDeleteDialog(especialista)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="btn btn-info"
                        onClick={() => handleNavigationClick(especialista)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
          {modalOpen && (
            <FormEspecialista
              title={formData.id_usuario ? 'Editar Especialista' : 'Crear Especialista'}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              setModalOpen={setModalOpen}
              setFormData={setFormData}
            />
          )}
    
          <ConfirmDialog
            isOpen={dialogOpen}
            onCancel={() => setDialogOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar eliminación"
            message={`¿Estás seguro de que deseas eliminar a ${selectedEspecialista?.nombre}?`}
          />
    
          {successDialogOpen && (
            <SuccessDialog
              message={successMessage}
              onClose={() => setSuccessDialogOpen(false)}
            />
          )}
        </div>
      </div>
    );
    
};

export default Especialista;
