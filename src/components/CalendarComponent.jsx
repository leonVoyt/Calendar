import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventForm from "./EventForm";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./styles.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  // Handle selecting time slots
  const handleSelectSlot = (slotInfo) => {
    setFormOpen(true);
    setSelectedEvent({
      start: moment(slotInfo.start).startOf("day").toDate(),
      end: moment(slotInfo.start).endOf("day").toDate(),
      title: "Default event",
      color: "#B02222",
      allDay: false,
    });
  };

  // Handle clicking on an event
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setFormOpen(true);
  };

  // Handle saving an event from the EventForm
  const handleSaveEvent = (newEvent) => {
    setEvents((prevEvents) => {
      const isExisting = prevEvents.find(
        (e) => e.title === selectedEvent.title
      );
      if (isExisting) {
        return prevEvents.map((e) =>
          e.title === selectedEvent.title ? newEvent : e
        );
      }
      localStorage.setItem(
        "storageEvents",
        JSON.stringify([...prevEvents, newEvent])
      );

      return [...prevEvents, newEvent];
    });
    setFormOpen(false);
  };
  useEffect(() => {
    const eventsFromStore = localStorage.getItem("storageEvents");
    if (eventsFromStore) {
      const parseIvents = JSON.parse(eventsFromStore);

      setEvents(
        parseIvents?.map((el) => ({
          ...el,
          start: moment(el.start).toDate(),
          end: moment(el.end).toDate(),
        }))
      );
    }
  }, []);
  // Handle deleting an event
  const handleDeleteEvent = () => {
    setEvents((prevEvents) =>
      prevEvents.filter((e) => e.title !== selectedEvent.title)
    );
    localStorage.setItem(
      "storageEvents",
      JSON.stringify(events.filter((e) => e.title !== selectedEvent.title))
    );
    setFormOpen(false);
  };

  // Handle dragging events to a new position
  const onEventDrop = ({ event, start, end }) => {
    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end, color: event.color };
    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    localStorage.setItem("storageEvents", JSON.stringify(nextEvents));

    setEvents(nextEvents);
  };

  // Handle resizing events by dragging
  const onEventResize = ({ event, start, end }) => {
    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end, color: event.color }
        : existingEvent;
    });
    localStorage.setItem("storageEvents", JSON.stringify(nextEvents));
    setEvents(nextEvents);
  };
  return (
    <div className="calendar-container">
      <DnDCalendar
        localizer={localizer}
        events={events}
        step={30}
        selectable
        showMultiDayTimes
        onDragOver={(e) => e.preventDefault()}
        defaultView="month"
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.color },
        })}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        onDropFromOutside={onEventDrop}
        style={{ height: "100vh" }}
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
  );
};

export default CalendarComponent;
