import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import moment from "moment";

// Use default parameters for the props
const EventForm = ({
  event = {},
  onSave = () => {},
  onDelete = () => {},
  onClose = () => {},
}) => {
  const [title, setTitle] = useState(event.title || "");
  const [color, setColor] = useState(event.color);

  useEffect(() => {
    setStart(moment(event.start).format("YYYY-MM-DDTHH:mm"));
    setEnd(moment(event.end).format("YYYY-MM-DDTHH:mm"));
  }, [event]);

  // Initialize start and end date states with event data or default to the current time
  const [start, setStart] = useState(
    moment(event.start).format("YYYY-MM-DDTHH:mm") ||
      moment().format("YYYY-MM-DDTHH:mm")
  );
  const [end, setEnd] = useState(
    moment(event.end).format("YYYY-MM-DDTHH:mm") ||
      moment().add(1, "hours").format("YYYY-MM-DDTHH:mm")
  );

  // Handle saving the event with the updated title, color, start, and end times
  const handleSave = () => {
    const updatedEvent = {
      ...event,
      title,
      color,
      start: moment(start).toDate(),
      end: moment(end).toDate(),
    };
    onSave(updatedEvent);
  };

  return (
    <div className="event-form">
      <h2>{event.title ? "Edit Event" : "Add New Event"}</h2>

      <div>
        <label>
          <strong>Start:</strong>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          <strong>End:</strong>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
      </div>

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

      <div className="event-form__btn--container">
        <button className="save" onClick={handleSave}>
          Save
        </button>
        {event.title && (
          <button className="delete" onClick={onDelete}>
            Delete
          </button>
        )}
        <button className="cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EventForm;
