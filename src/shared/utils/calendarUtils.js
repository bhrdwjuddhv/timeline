/*
==================================================
CALENDAR UTILITIES
Timeline Calendar Engine Utilities
==================================================
*/

import {
  getTasks,
  saveTasks,
  getCalendars,
} from "./storageUtils.js";


/*
==================================================
DATE HELPERS
==================================================
*/

export function pad(value) {

  return String(value).padStart(2, "0");
}

export function formatDate(date) {

  const year = date.getFullYear();

  const month = pad(
      date.getMonth() + 1
  );

  const day = pad(
      date.getDate()
  );

  return `${year}-${month}-${day}`;
}

export function parseDate(dateString) {

  return new Date(dateString);
}

export function isSameDay(dateA, dateB) {

  return (
      dateA.getFullYear() ===
      dateB.getFullYear() &&

      dateA.getMonth() ===
      dateB.getMonth() &&

      dateA.getDate() ===
      dateB.getDate()
  );
}


/*
==================================================
MONTH GENERATION
==================================================
*/

export function generateMonthDays(
    currentDate = new Date()
) {

  const year =
      currentDate.getFullYear();

  const month =
      currentDate.getMonth();

  const firstDay =
      new Date(year, month, 1);

  const lastDay =
      new Date(year, month + 1, 0);

  const startDate =
      new Date(firstDay);

  startDate.setDate(
      firstDay.getDate() -
      firstDay.getDay()
  );

  const endDate =
      new Date(lastDay);

  endDate.setDate(
      lastDay.getDate() +
      (6 - lastDay.getDay())
  );

  const days = [];

  const current =
      new Date(startDate);

  while (current <= endDate) {

    days.push({
      date: new Date(current),

      dateString:
          formatDate(current),

      day:
          current.getDate(),

      isCurrentMonth:
          current.getMonth() ===
          month,

      isToday:
          isSameDay(
              current,
              new Date()
          ),
    });

    current.setDate(
        current.getDate() + 1
    );
  }

  return days;
}


/*
==================================================
TASK FILTERING
==================================================
*/

export function getTasksForDate(
    tasks = [],
    dateString
) {

  return tasks.filter(
      (task) =>
          task.date === dateString
  );
}

export function getTasksForCalendar(
    tasks = [],
    calendarId
) {

  return tasks.filter(
      (task) =>
          task.calendarId ===
          calendarId
  );
}

export function getCompletedTasks(
    tasks = []
) {

  return tasks.filter(
      (task) => task.completed
  );
}

export function getPendingTasks(
    tasks = []
) {

  return tasks.filter(
      (task) => !task.completed
  );
}


/*
==================================================
TASK SORTING
==================================================
*/

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

export function sortTasks(
    tasks = []
) {

  return [...tasks].sort(
      (a, b) => {

        // POSITION FIRST
        if (
            a.position !== undefined &&
            b.position !== undefined
        ) {

          return (
              a.position -
              b.position
          );
        }

        // PRIORITY
        const priorityA =
            PRIORITY_ORDER[
                a.priority
                ] ?? 99;

        const priorityB =
            PRIORITY_ORDER[
                b.priority
                ] ?? 99;

        if (
            priorityA !== priorityB
        ) {

          return (
              priorityA -
              priorityB
          );
        }

        // UPDATED
        return (
            (b.updatedAt || 0) -
            (a.updatedAt || 0)
        );
      }
  );
}


/*
==================================================
GROUP TASKS BY DATE
==================================================
*/

export function groupTasksByDate(
    tasks = []
) {

  return tasks.reduce(
      (groups, task) => {

        const date =
            task.date || "undated";

        if (!groups[date]) {

          groups[date] = [];
        }

        groups[date].push(task);

        return groups;

      },
      {}
  );
}


/*
==================================================
TASK STATISTICS
==================================================
*/

export function getCalendarStats(
    tasks = []
) {

  const completed =
      tasks.filter(
          (task) => task.completed
      ).length;

  const pending =
      tasks.length - completed;

  const overdue =
      tasks.filter((task) => {

        if (
            !task.date ||
            task.completed
        ) {
          return false;
        }

        return (
            new Date(task.date) <
            new Date()
        );

      }).length;

  return {
    total: tasks.length,
    completed,
    pending,
    overdue,
  };
}


/*
==================================================
ORPHAN CLEANUP
==================================================
*/

export function getValidTasks(
    tasks,
    calendars
) {

  const calendarIds =
      calendars.map(
          (calendar) =>
              calendar.id
      );

  return tasks.filter(
      (task) =>
          calendarIds.includes(
              task.calendarId
          )
  );
}

export function cleanupOrphanTasks() {

  try {

    const tasks = getTasks();

    const calendars = getCalendars();

    const validTasks = getValidTasks(tasks, calendars);

    if (validTasks.length !== tasks.length) {

      /*
      saveTasks now dispatches to Redux.
      The middleware persists to localStorage.
      */
      saveTasks(validTasks);

      console.log(
          `Cleaned ${tasks.length - validTasks.length} orphan tasks.`
      );
    }

  } catch (error) {

    console.error("Error cleaning orphan tasks:", error);
  }
}


/*
==================================================
SYNC HELPERS
==================================================
*/

export function getPendingTasksOnly(
    tasks = []
) {

  return tasks.filter(
      (task) =>
          task.syncStatus ===
          "pending"
  );
}

export function getFailedTasks(
    tasks = []
) {

  return tasks.filter(
      (task) =>
          task.syncStatus ===
          "failed"
  );
}


/*
==================================================
DRAG & DROP HELPERS
==================================================
*/

export function reorderTasks(
    tasks = []
) {

  return tasks.map(
      (task, index) => ({
        ...task,
        position: index,
      })
  );
}

export function moveTaskToDate(
    task,
    newDate,
    newPosition = 0
) {

  return {

    ...task,

    date: newDate,

    position: newPosition,

    updatedAt: Date.now(),

    syncStatus: "pending",
  };
}


/*
==================================================
SEARCH + FILTERS
==================================================
*/

export function searchTasks(
    tasks = [],
    query = ""
) {

  if (!query.trim()) {
    return tasks;
  }

  const lower =
      query.toLowerCase();

  return tasks.filter(
      (task) =>

          task.title
              ?.toLowerCase()
              .includes(lower) ||

          task.description
              ?.toLowerCase()
              .includes(lower)
  );
}

export function filterTasksByPriority(
    tasks = [],
    priority
) {

  if (!priority) {
    return tasks;
  }

  return tasks.filter(
      (task) =>
          task.priority ===
          priority
  );
}