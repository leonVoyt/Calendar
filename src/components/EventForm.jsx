// src/components/EventForm.js

import React, { useState } from "react";
import { ChromePicker } from "react-color";

const EventForm = ({ event, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState(event.title || "");
  const [color, setColor] = useState(event.color || "#3174ad");

  const handleSave = () => {
    const updatedEvent = { ...event, title, color };
    onSave(updatedEvent);
  };

  return (
    <div className="event-form">
      <h2>{event.title ? "Edit Event" : "Add New Event"}</h2>
      <input
        type="text"
        value={title}
        maxLength="30"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event name (max 30 chars)"
      />
      <ChromePicker
        color={color}
        onChangeComplete={(newColor) => setColor(newColor.hex)}
      />
      <button onClick={handleSave}>Save</button>
      {event.title && <button onClick={onDelete}>Delete</button>}
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EventForm;
