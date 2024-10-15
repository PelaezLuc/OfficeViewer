import React, { useEffect, useState } from 'react';
import MapComponent from './components/MapComponent';

const App = () => {
  const [offices, setOffices] = useState([]); // Almacena todas las oficinas
  const [selectedTerritorial, setSelectedTerritorial] = useState('madrid'); // Predeterminado 'all'
  const [officeCount, setOfficeCount] = useState(0); // Estado para almacenar el número de oficinas mostradas

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await fetch('/offices.json'); // Cambia esta línea según donde esté tu JSON
        const data = await response.json();
        setOffices(data);
      } catch (error) {
        console.error('Error fetching offices:', error);
      }
    };

    fetchOffices();
  }, []);

  const handleTerritorialChange = (event) => {
    setSelectedTerritorial(event.target.value);
  };

  // Filtra las oficinas según el territorial seleccionado
  const filteredOffices = selectedTerritorial === 'all'
    ? offices // Si selecciona "all", muestra todas las oficinas
    : offices.filter(office => office.territorial === selectedTerritorial); // Filtrar por territorial

  // Actualiza el número de oficinas cada vez que cambian las oficinas o el territorial
  useEffect(() => {
    setOfficeCount(filteredOffices.length); // Actualiza el número de oficinas en el estado
  }, [filteredOffices]);

  return (
    <div>
      <h1>Santander Installation Map</h1>
      <div className="main-container">
        <p>Número de oficinas: <span>{officeCount}</span></p> {/* Muestra el número de oficinas */}
        <select id="territorial-select" value={selectedTerritorial} onChange={handleTerritorialChange}>
          <option value="madrid">Madrid</option>
          <option value="galicia">Galicia</option>
          <option value="cantabria-asturias">Cantabria-Asturias</option>
          <option value="pais vasco">País Vasco</option>
          <option value="aragon-navarra-la rioja">Aragón-Navarra-La Rioja</option>
          <option value="cataluña">Cataluña</option>
          <option value="valencia-murcia">Valencia-Murcia</option>
          <option value="andalucia">Andalucía</option>
          <option value="castilla-leon">Castilla-León</option>
          <option value="extremadura">Extremadura</option>
          <option value="la mancha">La Mancha</option>
          <option value="canarias">Canarias</option>
          <option value="baleares">Baleares</option>
          <option value="all">Todas</option>
        </select>
        <MapComponent offices={filteredOffices} territorial={selectedTerritorial} /> {/* Solo pasa oficinas filtradas */}
      </div>
    </div>
  );
};

export default App;
