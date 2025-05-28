import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <strong>Farmacia</strong>
                </NavLink>
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
                        {[
                            { to: "/medicamentos", label: "Medicamentos" },
                            { to: "/carrito", label: "Carrito" },
                            { to: "/histventas", label: "Historial de Ventas" },
                            { to: "/farmacias", label: "Otras Farmacias" },
                            { to: "/bodega", label: "Bodega" },
                            { to: "/solicitudes", label: "Historial Solicitudes" },
                        ].map((item, index) => (
                            <li className="nav-item" key={index}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        "nav-link" + (isActive ? " active" : "")
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
