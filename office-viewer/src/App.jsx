import { useState, useEffect } from 'react';
import data from './data/offices.json';
import Map from './components/Map';
import './App.css'

function App() {
  const [territorial, setTerritorial] = useState("");
  const [offices, setOffices] = useState([]);
  const [officeCount, setOfficeCount] = useState(0);
  const [showOfficeCode, setShowOfficeCode] = useState(false);

  /* Filtrar oficinas al modificar el territorial */
  useEffect(() => {
    const officeByTerritorial = data.filter((office) => {
      return office.territorial === territorial;
    });
    setOffices(officeByTerritorial);
    setOfficeCount(officeByTerritorial.length);
  }, [territorial]);

  const handleTerritorialChange = (event) => {
    setTerritorial(event.target.value);
  }

  const handleShowOfficeCode = () => {
    setShowOfficeCode(prevState => !prevState);
  }

  return (
    <>
      <h1>Santander Installation Map</h1>
      <header>
        <nav>
          <p>Número de oficinas: {officeCount}</p>
          <select id="territorial-selection" value={territorial} onChange={handleTerritorialChange}>
            <option value="" disabled>Selecciona un territorio</option>
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
          </select>
          <select id="marker-select" onChange={handleShowOfficeCode}>
            <option value="default">Marcador por defecto</option>
            <option value="officeCode">Mostrar código de oficina</option>
          </select>
        </nav>
      </header>
      <main>
        <Map territorial={territorial} offices={offices} showOfficeCode={showOfficeCode}></Map>
      </main>
      <footer>
        <p>©Lucas Peláez</p> 
      </footer>
    </>
  )
}

export default App
