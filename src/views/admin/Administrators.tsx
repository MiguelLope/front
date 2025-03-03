import React, { useState, useEffect } from 'react';
import { FormAdministrators } from './components/FormAdministrators';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { ConfirmDialog, SuccessDialog } from '../components/Dialog';

type Administrador = {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  curp: string;
  contraseña: string;
  tipo_usuario: string;
};

const Administrators = () => {
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [formData, setFormData] = useState<Partial<Administrador>>({
    id_usuario: 0,
    nombre: '',
    email: '',
    telefono: '',
    curp: '',
    contraseña: '',
    tipo_usuario: 'admin',
  });
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Administrador | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/administradores')
      .then((response) => {
        setAdministradores(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los administradores:', error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id_usuario) {
      axios
        .put(`http://127.0.0.1:8000/api/usuarios/${formData.id_usuario}`, formData)
        .then((response) => {
          setAdministradores((prev) =>
            prev.map((admin) =>
              admin.id_usuario === formData.id_usuario ? response.data : admin
            )
          );
          setSuccessMessage('Administrador actualizado con éxito.');
          setSuccessDialogOpen(true);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error al actualizar administrador:', error);
        });
    } else {
      axios
        .post('http://127.0.0.1:8000/api/usuarios', formData)
        .then((response) => {
          setAdministradores((prev) => [...prev, response.data]);
          setSuccessMessage('Administrador agregado con éxito.');
          setSuccessDialogOpen(true);
        })
        .catch((error) => {
          console.error('Error al agregar administrador:', error);
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
      tipo_usuario: 'admin',
    });
  };

  const handleEdit = (admin: Administrador) => {
    setFormData(admin);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (admin: Administrador) => {
    setSelectedAdmin(admin);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAdmin) {
      axios
        .delete(`http://127.0.0.1:8000/api/usuarios/${selectedAdmin.id_usuario}`)
        .then(() => {
          setAdministradores((prev) =>
            prev.filter((admin) => admin.id_usuario !== selectedAdmin.id_usuario)
          );
          setSuccessMessage('Administrador eliminado con éxito.');
          setSuccessDialogOpen(true);
        })
        .catch((error) => {
          console.error('Error al eliminar el administrador:', error);
        });
    }
    setDialogOpen(false);
    setSelectedAdmin(null);
  };

  const filteredAdministradores = administradores.filter(
    (admin) => admin.nombre && admin.nombre.toLowerCase().includes(search.toLowerCase())
  );
  

  return (
    <div>
      <NavBar select="usuarios" />
      <div className="container my-5">
        <h2 className="text-center mb-4">Administradores</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex w-100">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar administrador..."
              value={search}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-success"
              onClick={() => setModalOpen(true)}
            >
              Crear Administrador
            </button>
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
            {filteredAdministradores.map((admin) => (
              <tr key={admin.id_usuario}>
                <td>{admin.nombre}</td>
                <td>{admin.email}</td>
                <td>{admin.telefono}</td>
                <td>{'*'.repeat(8)}</td>
                <td>{admin.curp}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEdit(admin)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleOpenDeleteDialog(admin)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {modalOpen && (
          <FormAdministrators
            title={formData.id_usuario ? 'Editar Administrador' : 'Crear Administrador'}
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
          message={`¿Estás seguro de que deseas eliminar a ${selectedAdmin?.nombre}?`}
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

export default Administrators;
