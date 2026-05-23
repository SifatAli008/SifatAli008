"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BookingSlot {
  date: Date;
  time: string;
  label: string;
}

const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatSlotLabel(date: Date, time: string, tzLabel: string): string {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}, ${time} (${tzLabel})`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

interface BookingCalendarProps {
  timezoneLabel: string;
  value: BookingSlot | null;
  onChange: (slot: BookingSlot) => void;
}

export function BookingCalendar({
  timezoneLabel,
  value,
  onChange,
}: BookingCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(() => value?.date ?? today);
  const [selectedTime, setSelectedTime] = useState(value?.time ?? "8:00 AM");

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" }).toUpperCase();

  const calendarDays = useMemo(() => {
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  }, [year, month]);

  const selectDate = (date: Date) => {
    if (date < today) return;
    setSelectedDate(date);
    onChange({
      date,
      time: selectedTime,
      label: formatSlotLabel(date, selectedTime, timezoneLabel),
    });
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
    onChange({
      date: selectedDate,
      time,
      label: formatSlotLabel(selectedDate, time, timezoneLabel),
    });
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectedDayLabel = selectedDate
    .toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

  const nowTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div
      className="overflow-hidden border-[3px] border-ink bg-cream"
      style={{ boxShadow: "6px 6px 0 0 #0a0a0a" }}
    >
      <div className="grid lg:grid-cols-[1fr_180px]">
        <div className="border-b-[3px] border-ink p-5 lg:border-b-0 lg:border-r-[3px]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream transition-colors hover:bg-ink hover:text-cream"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <p className="label-mono text-ink">{monthLabel}</p>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream transition-colors hover:bg-ink hover:text-cream"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="label-mono py-1 text-[9px] text-muted">
                {d}
              </span>
            ))}
            {calendarDays.map((day, i) => {
              if (!day) return <span key={`empty-${i}`} />;
              const disabled = day < today;
              const selected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, today);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDate(day)}
                  className={`mx-auto flex h-9 w-9 items-center justify-center font-mono text-sm transition-colors ${
                    disabled
                      ? "cursor-not-allowed text-ink/25"
                      : selected
                        ? "border-2 border-ink bg-ink font-bold text-cream"
                        : isToday
                          ? "border-2 border-ink font-bold text-ink"
                          : "text-ink hover:bg-accent/30"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <p className="label-mono mt-4 text-[10px] text-ink/70">
            {timezoneLabel} · {nowTime}
          </p>
        </div>

        <div className="flex max-h-[300px] flex-col bg-cream p-4 lg:max-h-none">
          <p className="label-mono mb-3 text-ink">{selectedDayLabel}</p>
          <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {TIME_SLOTS.map((time) => {
              const active = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => selectTime(time)}
                  className={`w-full border-l-[4px] px-3 py-2 text-left font-mono text-xs transition-colors ${
                    active
                      ? "border-ink bg-ink font-bold text-cream"
                      : "border-transparent text-ink hover:border-ink/40 hover:bg-accent/20"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function getDefaultBookingSlot(timezoneLabel: string): BookingSlot {
  const date = startOfDay(new Date());
  const time = "8:00 AM";
  return { date, time, label: formatSlotLabel(date, time, timezoneLabel) };
}
