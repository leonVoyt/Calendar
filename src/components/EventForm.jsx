import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import moment from "moment";

const EventForm = ({
  event = {},
  onSave = () => {},
  onDelete = () => {},
  onClose = () => {},
}) => {
  const [title, setTitle] = useState(event.title || "");
  const [color, setColor] = useState(event.color);
  const [start, setStart] = useState(
    moment(event.start).format("YYYY-MM-DDTHH:mm") ||
      moment().format("YYYY-MM-DDTHH:mm")
  );
  const [end, setEnd] = useState(
    moment(event.end).format("YYYY-MM-DDTHH:mm") ||
      moment().add(1, "hours").format("YYYY-MM-DDTHH:mm")
  );
  const [error, setError] = useState(null);
  useEffect(() => {
    setTitle(event.title || "");
    setColor(event.color || "");
    setStart(moment(event.start).format("YYYY-MM-DDTHH:mm"));
    setEnd(moment(event.end).format("YYYY-MM-DDTHH:mm"));
  }, [event]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    setError(null);
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
        onChange={(e) => {
          setError(null);
          setTitle(e.target.value);
        }}
        placeholder="Event name (max 30 chars)"
      />
      {error && <div className="error">{error}</div>}{" "}
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
