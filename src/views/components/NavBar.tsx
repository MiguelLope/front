// Tipado para el parámetro `select`
type NavBarProps = {
    select: string;
};

const NavBar = ({ select }: NavBarProps) => {

    const handleLogout = () => {
        localStorage.removeItem('usr');
        window.location.href = '/login'; // Redirige a la página de inicio de sesión
    };

    const userString = localStorage.getItem('usr');
    const user = userString ? JSON.parse(userString) : null;


    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#00796b' }}>
            <div className="container">
                <a className="navbar-brand" href="#">Mi Clínica</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className={`nav-link ${select === 'inicio' ? 'active' : ''}`} href="/">Inicio</a>
                        </li>

                        {user && user.tipo_usuario === 'admin' && (
                            <li className="nav-item dropdown">
                                <a className={`nav-link dropdown-toggle ${select === 'usuarios' ? 'active' : ''}`}
                                    href="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">Usuarios</a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/admin/admin">Administradores</a></li>
                                    <li><a className="dropdown-item" href="/admin/specialists">Especialistas</a></li>
                                    <li><a className="dropdown-item" href="/admin/patients">Pacientes</a></li>

                                </ul>
                            </li>
                        )}

                        {user && user.tipo_usuario === 'especialista' && (
                            <li className="nav-item dropdown">
                                <a className={`nav-link dropdown-toggle ${select === 'usuarios' ? 'active' : ''}`}
                                    href="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">Usuarios</a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/especialist/patients">Pacientes</a></li>
                                </ul>
                            </li>
                        )}

                        {user && user.tipo_usuario === 'admin' && (
                            <li className="nav-item">
                                <a className={`nav-link ${select === 'consultorios' ? 'active' : ''}`} href="/admin/clinics">Consultorios</a>
                            </li>
                        )}
                        {user ? (
                            <li className="nav-item">
                                <a className={`nav-link ${select === 'historial' ? 'active' : ''}`} href="/record">Historial</a>
                            </li>
                        ) : (null)}

                        {user && user.tipo_usuario === 'admin' && (
                            <li className="nav-item">
                                <a className={`nav-link ${select === 'dating' ? 'active' : ''}`} href="/admin/dating">Citas</a>
                            </li>
                        )}

                        {user && user.tipo_usuario === 'paciente' && (
                            <li className="nav-item">
                                <a className={`nav-link ${select === 'dating' ? 'active' : ''}`} href="/pacientes/dating">Citas</a>
                            </li>
                        )}


                        {user && user.tipo_usuario === 'admin' && (
                            <li className="nav-item">
                                <a className={`nav-link ${select === 'contact' ? 'active' : ''}`} href="admin/contact">Contacto</a>
                            </li>
                        )}

                        {!user || user?.tipo_usuario !== 'admin' && user?.tipo_usuario !== 'especialista' && (
                            <li className="nav-item">
                                <a className={`nav-link ${select === 'contact' ? 'active' : ''}`} href="/contact">Contacto</a>
                            </li>
                        )}

                        {!user && (
                            <li className="nav-item">
                                <a className={`nav-link ${select === 'contact' ? 'active' : ''}`} href="/contact">Contacto</a>
                            </li>
                        )}

                            <li className="nav-item">
                                <a className={`nav-link ${select === 'pagos' ? 'active' : ''}`} href="/pay">Pagos</a>
                            </li>
                      

                        {/* Si hay usuario, muestra "Cerrar Sesión", si no, muestra "Iniciar Sesión" */}
                        <li className="nav-item">
                            {user ? (
                                <a className="nav-link" href="#" onClick={handleLogout}>Cerrar Sesión</a>
                            ) : (
                                <a className="nav-link" href="/login">Iniciar Sesión</a>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
