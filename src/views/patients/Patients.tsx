import React, { useState, useEffect } from 'react';
import { FormPaciente } from './components/FormPatients';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { ConfirmDialog, SuccessDialog } from '../components/Dialog';

type Paciente = {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  curp: string;
  contraseña: string;
  tipo_usuario: string;
};

const Paciente = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [formData, setFormData] = useState<Partial<Paciente>>({
    id_usuario: 0,
    nombre: '',
    email: '',
    telefono: '',
    curp: '',
    contraseña: '',
    tipo_usuario: 'paciente',
  });
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const userString = localStorage.getItem('usr');
  const user = userString ? JSON.parse(userString) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    axios
      .get('https://back-production-47e5.up.railway.app/api/pacientes')
      .then((response) => {
        setPacientes(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los paciente:', error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id_usuario) {
      axios
        .put(`https://back-production-47e5.up.railway.app/api/usuarios/${formData.id_usuario}`, formData)
        .then((response) => {
          setPacientes((prev) =>
            prev.map((paciente) =>
              paciente.id_usuario === formData.id_usuario ? response.data : paciente
            )
          );
          setSuccessMessage('Paciente actualizado con éxito.');
          setSuccessDialogOpen(true);
          window.location.reload();

        })
        .catch((error) => {
          console.error('Error al actualizar paciente:', error);
        });
    } else {
      axios
        .post('https://back-production-47e5.up.railway.app/api/usuarios', formData)
        .then((response) => {
          setPacientes((prev) => [...prev, response.data]);
          setSuccessMessage('Paciente agregado con éxito.');
          setSuccessDialogOpen(true);
        })
        .catch((error) => {
          console.error('Error al agregar paciente:', error);
        });
    }
    setModalOpen(false);
    setFormData({
      id_usuario: 0,
      nombre: '',
      email: '',
      telefono: '',
      curp: '',
      contraseña: '',
      tipo_usuario: 'paciente',
    });
  };

  const handleEdit = (paciente: Paciente) => {
    setFormData(paciente);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPaciente) {
      axios
        .delete(`https://back-production-47e5.up.railway.app/api/usuarios/${selectedPaciente.id_usuario}`)
        .then(() => {
          setPacientes((prev) =>
            prev.filter((paciente) => paciente.id_usuario !== selectedPaciente.id_usuario)
          );
          setSuccessMessage('Paciente eliminado con éxito.');
          setSuccessDialogOpen(true);
        })
        .catch((error) => {
          console.error('Error al eliminar el Paciente:', error);
        });
    }
    setDialogOpen(false);
    setSelectedPaciente(null);
  };

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <NavBar select="usuarios" />
      <div className="container my-5">
        <h2 className="text-center mb-4">Pacientes</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex w-100">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar Paciente..."
              value={search}
              onChange={handleSearchChange}
            />
            {user.tipo_usuario === 'admin' && (
              <button
                className="btn btn-success"
                onClick={() => setModalOpen(true)}
              >
                Crear Paciente
              </button>
            )}
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Contraseña</th>
              <th>CURP</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPacientes.map((paciente) => (
              <tr key={paciente.id_usuario}>
                <td>{paciente.nombre}</td>
                <td>{paciente.email}</td>
                <td>{paciente.telefono}</td>
                <td>{'*'.repeat(8)}</td>
                <td>{paciente.curp}</td>
                <td>
                  {
                    user.tipo_usuario === 'admin' && (
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleEdit(paciente)}>
                        Editar
                      </button>
                    )
                  }
                  {
                    user.tipo_usuario === 'admin' && (
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleOpenDeleteDialog(paciente)}>
                        Eliminar
                      </button>
                    )
                  }
                  <button className="btn btn-success "> Ver</button>
                </td>


              </tr>
            ))}
          </tbody>
        </table>

        {modalOpen && (
          <FormPaciente
            title={formData.id_usuario ? 'Editar Paciente' : 'Crear Paciente'}
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
          message={`¿Estás seguro de que deseas eliminar a ${selectedPaciente?.nombre}?`}
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

export default Paciente;
