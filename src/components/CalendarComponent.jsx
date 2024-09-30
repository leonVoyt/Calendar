// src/components/CalendarComponent.js

import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventForm from "./EventForm";
// import { DragDropContext } from "react-dnd";a
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleSelectSlot = (slotInfo) => {
    setFormOpen(true);
    setSelectedEvent({
      start: slotInfo.start,
      end: slotInfo.end,
      title: "",
      color: "#3174ad",
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setFormOpen(true);
  };

  const handleSaveEvent = (newEvent) => {
    setEvents((prevEvents) => {
      const isExisting = prevEvents.find((e) => e === selectedEvent);
      if (isExisting) {
        return prevEvents.map((e) => (e === selectedEvent ? newEvent : e));
      }
      return [...prevEvents, newEvent];
    });
    setFormOpen(false);
  };

  const handleDeleteEvent = () => {
    setEvents((prevEvents) => prevEvents.filter((e) => e !== selectedEvent));
    setFormOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          style={{ height: "100vh" }}
          eventPropGetter={(event) => ({
            style: { backgroundColor: event.color },
          })}
          defaultView="month"
        />
        {formOpen && (
          <EventForm
            event={selectedEvent}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setFormOpen(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default CalendarComponent;
