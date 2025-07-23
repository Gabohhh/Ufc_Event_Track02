import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchEvents } from "./api/ufcApi";

function App() {
  const [events, setEvents] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setLoading(false);
      });
  }, []);

  // Get today's date at midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter only future events (today or later), sort by date, and take up to 4
  const futureEvents = events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  // The closest event is the first in the sorted futureEvents array
  const closestEvent = futureEvents.length ? futureEvents[0] : null;

  const handleSetReminder = (event) => {
    setReminder(event);
  };

  const handleCancelReminder = () => {
    setReminder(null);
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
                <p>Date: {event.date}</p>
                <span className={`status ${event.status.toLowerCase().replace(" ", "-")}`}>
                  {event.status}
                </span>
                <div className="reminder-section">
                  <button onClick={() => handleSetReminder(event)}>
                    Set Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {reminder && (
          <div className="reminder-display">
            <p>
              Reminder set for: <strong>{reminder.name}</strong> on {reminder.date}
            </p>
            <button className="cancel-btn" onClick={handleCancelReminder}>
              Cancel Reminder
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;