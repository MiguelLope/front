import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../componentes/Navbar";

interface MedicamentoBase {
  nombre_generico: string;
  nombre_medico: string;
  farmacia?: string;
}

interface MedicamentoLocal extends MedicamentoBase {
  id_medicamento: number;
  precio_venta: number;
  unidades_por_caja: number;
}

interface Medicamento1 {
  idMedicamento: string;
  nombre_generico: string;
  nombre_medico: string;
  existencias?: number;
  precio?: number;
  farmacia?: string;
}

interface Medicamento2 extends MedicamentoBase {
  idMedicamento: number;
  precio: number;
  existencias: number;
}

interface Medicamento5 extends MedicamentoBase {
  id: number;
  PrecioVenta: number;
  Stock: number;
}

interface Medicamento8 extends MedicamentoBase {
  id_medicamento: string;
  contenido: string;
  forma_farmacologica: string;
  presentacion: string;
  fecha_fabricacion: string;
  fecha_caducidad: string;
  unidad_por_caja: number;
  stock: number;
  fabricante: string;
  precio: string;
}

type MedicamentoGeneral =
  | MedicamentoLocal
  | Medicamento2
  | Medicamento5
  | Medicamento8
  | Medicamento1;

const Consultas = () => {
  const [medicamentos, setMedicamentos] = useState<MedicamentoGeneral[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [farmaciaId, setFarmaciaId] = useState<string>("local");

  const rutasPorFarmacia: Record<string, string> = {
    local: "https://back-production-8a10.up.railway.app/api/medicamentos",
    farmacia1: "https://back-production-8a10.up.railway.app/api/medicamentos/farmacia1",
    farmacia2: "https://back-production-8a10.up.railway.app/api/medicamentos/farmacia2",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (farmaciaId === "todasfarmacias") {
          const requests = Object.entries(rutasPorFarmacia).map(async ([id, url]) => {
            const res = await axios.get(url);
            return res.data.map((med: any) => ({
              ...med,
              farmacia: id,
            }));
          });
          const results = await Promise.all(requests);
          setMedicamentos(results.flat());
        } else {
          const res = await axios.get(rutasPorFarmacia[farmaciaId]);
          const data = res.data.map((med: any) => ({
            ...med,
            farmacia: farmaciaId,
          }));
          setMedicamentos(data);
        }
      } catch (error) {
        console.error("Error al obtener medicamentos", error);
      }
    };

    fetchData();
  }, [farmaciaId]);

  const filteredMedicamentos = medicamentos.filter((m) =>
    m.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProperty = (med: MedicamentoGeneral, ...props: string[]): string | number => {
    for (const prop of props) {
      if (prop in med) {
        const val = (med as any)[prop];
        return typeof val === "number" || typeof val === "string" ? val : "N/A";
      }
    }
    return "N/A";
  };

  const formatPrice = (price: string | number): string => {
    if (price === "N/A") return "N/A";
    const num = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(num)) return "N/A";
    return `$${Math.round(num * 100) / 100}`;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Buscar Medicamentos</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-col md:w-1/2">
            <label className="mb-2 text-sm text-gray-700">Selecciona una farmacia:</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "local", label: "Nosotros" },
                { id: "farmacia1", label: "Farmacia 1" },
                { id: "farmacia2", label: "Farmacia 2" },
                { id: "todasfarmacias", label: "Todas" },
              ].map((farmacia) => (
                <button
                  key={farmacia.id}
                  onClick={() => setFarmaciaId(farmacia.id)}
                  className={`px-4 py-2 rounded-md border text-sm transition-all duration-200 ${
                    farmaciaId === farmacia.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {farmacia.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:w-1/2">
            <label className="mb-2 text-sm text-gray-700">Buscar por nombre genérico:</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej. paracetamol"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto shadow border rounded-md">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Nombre Genérico</th>
                <th className="px-4 py-2 border-b">Nombre Médico</th>
                <th className="px-4 py-2 border-b">Precio</th>
                <th className="px-4 py-2 border-b">Stock</th>
                <th className="px-4 py-2 border-b">Farmacia</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicamentos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No se encontraron medicamentos.
                  </td>
                </tr>
              ) : (
                filteredMedicamentos.map((med, idx) => {
                  const id = getProperty(med, "id_medicamento", "idMedicamento", "id");
                  const precio = getProperty(med, "precio_venta", "precio", "PrecioVenta");
                  const stock = getProperty(med, "unidades_por_caja", "existencias", "stock", "Stock");

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{id}</td>
                      <td className="px-4 py-2 border-b">{med.nombre_generico}</td>
                      <td className="px-4 py-2 border-b">{med.nombre_medico}</td>
                      <td className="px-4 py-2 border-b">{formatPrice(precio)}</td>
                      <td className="px-4 py-2 border-b">{stock}</td>
                      <td className="px-4 py-2 border-b">{(med as any).farmacia}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Consultas;
