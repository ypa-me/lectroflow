'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import pb from "@/lib/pocketbase";
import { useState, useEffect, useMemo } from 'react'

interface EventData {
  id: string;
  title: string;
  start: string;
  extendedProps: {
    message: string;
    price: number;
    confirmation: boolean;
  };
}

interface EventDetailPopupProps {
  event: EventData | null;
  position: { x: number; y: number } | null;
}

function EventDetailPopup({ event, position }: EventDetailPopupProps) {
  if (!event || !position) return null;

  return (
    <div
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[250px] max-w-[350px] animate-in fade-in zoom-in duration-200"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <h3 className="font-semibold text-lg mb-2 text-gray-900 border-b pb-2">{event.title}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Message:</span>
          <span className="text-gray-900 max-w-[200px] break-words">{event.extendedProps.message}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Price:</span>
          <span className="text-gray-900 font-medium">${event.extendedProps.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Confirmation:</span>
          <span className={`font-medium ${event.extendedProps.confirmation ? 'text-green-600' : 'text-red-500'}`}>
            {event.extendedProps.confirmation ? '✓ Confirmed' : '✗ Pending'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Date:</span>
          <span className="text-gray-900">{new Date(event.start).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function TodaysEvents({ events }: { events: EventData[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  }, [events]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-900 pb-2 border-b-2 border-gray-200">
        Due Today ({todaysEvents.length})
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {todaysEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-8 italic">No events due today</p>
        ) : (
          todaysEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-50 border-l-4 border-blue-500 rounded-r-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.extendedProps.message}</p>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="font-medium text-gray-900">${event.extendedProps.price}</span>
                <span className={`px-2 py-1 rounded-full ${event.extendedProps.confirmation ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {event.extendedProps.confirmation ? 'Confirmed' : 'Pending'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([])
  const [hoveredEvent, setHoveredEvent] = useState<EventData | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      await pb.collection('Admins').authWithPassword('admin@local.com', '123456789')

      const records = await pb.collection('Orders').getFullList({
        sort: 'Deadline',
      })

      const mapped = records.map((r: any) => ({
        id: r.id,
        title: r.Title,
        start: r.Deadline,
        extendedProps: {
          message: r.Message,
          price: r.Price,
          confirmation: r.Confirmation,
        },
      }))

      setEvents(mapped)
    }

    fetchEvents()
  }, [])

  const calculatePopupPosition = (clientX: number, clientY: number) => {
    const popupWidth = 350;
    const popupHeight = 200;
    const padding = 10;
    
    // Calculate X position - keep within viewport
    let x = clientX + padding;
    if (x + popupWidth > window.innerWidth) {
      x = clientX - popupWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }
    
    // Calculate Y position - show above if near bottom
    let y = clientY + padding;
    if (y + popupHeight > window.innerHeight) {
      y = clientY - popupHeight - padding;
    }
    if (y < padding) {
      y = padding;
    }
    
    return { x, y };
  }

  const handleEventMouseEnter = (info: any) => {
    const eventData: EventData = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      extendedProps: info.event.extendedProps,
    }
    setHoveredEvent(eventData)
    setPopupPosition(calculatePopupPosition(info.jsEvent.clientX, info.jsEvent.clientY))
  }

  const handleEventMouseLeave = () => {
    setHoveredEvent(null)
    setPopupPosition(null)
  }

  const handleEventClick = (info: any) => {
    const eventData: EventData = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      extendedProps: info.event.extendedProps,
    }
    setHoveredEvent(eventData)
    setPopupPosition(calculatePopupPosition(info.jsEvent.clientX, info.jsEvent.clientY))
  }

  return (
    <div className="bg-black font-sans h-full lg:overflow-hidden">
      <EventDetailPopup event={hoveredEvent} position={popupPosition} />
      
      <main className="w-full h-full bg-white text-black mt-[25px]">
        <section className="lg:h-[calc(100%-25px)] w-full p-4 lg:p-6 lg:overflow-hidden">
          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
            
            {/* Calendar Section - Takes full width on mobile, 8/12 on desktop */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 min-h-[500px] lg:min-h-0">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView='dayGridMonth'
                  height="100%"
                  events={events}
                  eventMouseEnter={handleEventMouseEnter}
                  eventMouseLeave={handleEventMouseLeave}
                  eventClick={handleEventClick}
                  eventContent={(arg) => {
                    const isConfirmed = arg.event.extendedProps.confirmation
                    return (
                      <div className={`px-2 py-1 rounded text-xs font-medium truncate cursor-pointer transition-all hover:scale-105 ${
                        isConfirmed 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${isConfirmed ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          <span className="truncate">{arg.event.title}</span>
                        </div>
                      </div>
                    )
                  }}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                  }}
                  buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week'
                  }}
                />
              </div>
            </div>

            
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full min-h-[300px] lg:min-h-0">
                <TodaysEvents events={events} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
