import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import './App.css';

const position = [38.7248464,-9.145971];

const getTimes = async (busStop, results = 10) => {
  const response = await fetch(`https://carris.tecmic.com/api/v2.7/Estimations/busStop/${busStop}/top/${results}`);
  const waitingTimes = await response.json();
  console.log(waitingTimes);
  return waitingTimes;
}

const formatDate = (timestamp) => {
  const formattedDate = new Date(timestamp);

  return   formattedDate.toLocaleString('en-US', { second: 'numeric', minute: 'numeric', hour: 'numeric', hour12: false });
}

function App() {

  const [ paragens, setParagens ] = useState([]);
  const [ horarios, setHorarios ] = useState([]);

  useEffect(() => {
    fetch('https://carris.tecmic.com/api/v2.7/busstops').then(response => response.json()).then((paragens) => setParagens(paragens.slice(0, 200)))
  }, [])
  return (
    <Map center={position} zoom={15}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
    <Marker position={position}>
      <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
    </Marker>
    {
      paragens.map((paragem) => <Marker key={paragem.id} position={[paragem.lat, paragem.lng]} onClick={async () => {
        const horarios = await getTimes(paragem.id);
        setHorarios(horarios);
      } }>
        <Popup>{paragem.name} <br/>
    {horarios.map(({ routeNumber, routeName, time }) => <div>{routeNumber} - {routeName} - {formatDate(time)}</div>)}
        </Popup>
      </Marker>)
    }
  </Map>
  );
}

export default App;
