import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchEvents } from "./api/ufcApi";

function App() {
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar eventos desde la API
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setLoading(false);
      });

    // Cargar recordatorios desde localStorage
    const savedReminders = JSON.parse(localStorage.getItem("ufcReminders")) || [];
    setReminders(savedReminders);
  }, []);

  // Guardar recordatorios en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("ufcReminders", JSON.stringify(reminders));
  }, [reminders]);

  // obtener fecha de hoy a medianoche para comparaciones precisas
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // filtra solo los eventos futuros (hoy o otro dia), ordenados por fecha, hasta 4 eventos
  const futureEvents = events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  // El evento más cercano es el primero en el arreglo futureEvents ordenado
  const closestEvent = futureEvents.length ? futureEvents[0] : null;

  // Crear un nuevo recordatorio
  const handleCreateReminder = (event) => {
    setActiveReminder({
      id: Date.now(),
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      reminderName: `Recordatorio para ${event.name}`,
      description: `Evento UFC: ${event.name} el ${new Date(event.date).toLocaleDateString()}`,
      reminderDateTime: "",
      createdAt: new Date().toISOString()
    });
  };

  // Guardar un recordatorio
  const handleSaveReminder = () => {
    if (!activeReminder) return;
    
    // Validar fecha/hora
    if (!activeReminder.reminderDateTime) {
      alert("Por favor, selecciona una fecha y hora para el recordatorio");
      return;
    }
    
    // Actualizar o crear recordatorio
    if (editingReminder) {
      setReminders(reminders.map(r => 
        r.id === editingReminder.id ? {...activeReminder, id: editingReminder.id} : r
      ));
      setEditingReminder(null);
    } else {
      setReminders([...reminders, activeReminder]);
    }
    
    setActiveReminder(null);
  };

  // Editar un recordatorio existente
  const handleEditReminder = (reminder) => {
    setActiveReminder({...reminder});
    setEditingReminder(reminder);
  };

  // Eliminar un recordatorio
  const handleDeleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
    if (editingReminder?.id === id) setEditingReminder(null);
    if (activeReminder?.id === id) setActiveReminder(null);
  };

  // Cancelar creación/edición de recordatorio
  const handleCancelReminder = () => {
    setActiveReminder(null);
    setEditingReminder(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>UFC Event Tracker</h1>
      </header>
      <main>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="event-list">
            {futureEvents.map(event => (
              <div
                className={`event-card${closestEvent && event.id === closestEvent.id ? " closest-event" : ""}`}
                key={event.id}
              >
                {closestEvent && event.id === closestEvent.id && (
                  <span className="closest-badge">NEXT UP</span>
                )}
                <h3>{event.name}</h3>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <span className={`status ${event.status.toLowerCase().replace(" ", "-")}`}>
                  {event.status}
                </span>
                <div className="reminder-section">
                  <button onClick={() => handleCreateReminder(event)}>
                    Crear Recordatorio
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Formulario para crear/editar recordatorio */}
        {activeReminder && (
          <div className="reminder-form">
            <h2>
              {editingReminder 
                ? `Editando Recordatorio: ${activeReminder.eventName}` 
                : `Nuevo Recordatorio: ${activeReminder.eventName}`}
            </h2>
            
            <div className="form-group">
              <label>Nombre del Recordatorio:</label>
              <input
                type="text"
                value={activeReminder.reminderName}
                onChange={(e) => setActiveReminder({
                  ...activeReminder,
                  reminderName: e.target.value
                })}
                placeholder="Ej: Ver pelea principal"
              />
            </div>
            
            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                value={activeReminder.description}
                onChange={(e) => setActiveReminder({
                  ...activeReminder,
                  description: e.target.value
                })}
                placeholder="Detalles sobre este recordatorio"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Fecha y Hora del Recordatorio:</label>
              <input
                type="datetime-local"
                value={activeReminder.reminderDateTime}
                onChange={(e) => setActiveReminder({
                  ...activeReminder,
                  reminderDateTime: e.target.value
                })}
              />
            </div>
            
            <div className="form-actions">
              <button className="save-btn" onClick={handleSaveReminder}>
                {editingReminder ? "Actualizar" : "Guardar"} Recordatorio
              </button>
              <button className="cancel-btn" onClick={handleCancelReminder}>
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        {/* Lista de recordatorios existentes */}
        <div className="reminders-list">
          <h2>Tus Recordatorios</h2>
          
          {reminders.length === 0 ? (
            <p className="no-reminders">No tienes recordatorios programados</p>
          ) : (
            <div className="reminders-container">
              {reminders.map(reminder => (
                <div key={reminder.id} className="reminder-card">
                  <div className="reminder-header">
                    <h3>{reminder.reminderName}</h3>
                    <span className="event-name">{reminder.eventName}</span>
                  </div>
                  
                  <p className="reminder-description">{reminder.description}</p>
                  
                  <div className="reminder-details">
                    <div>
                      <strong>Fecha del evento:</strong> 
                      <span>{new Date(reminder.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <strong>Recordatorio programado:</strong> 
                      <span>{new Date(reminder.reminderDateTime).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="reminder-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditReminder(reminder)}
                    >
                      Editar
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;