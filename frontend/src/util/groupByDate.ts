export function groupByDate<T extends { createdAt: string; [key: string]: any }>(objects: T[]) {
  const groupedObjects: { [date: string]: T[] } = objects.reduce((acc, object) => {
    const createdAtDate = new Date(object.createdAt);
    const userTimeZoneOffsetMinutes = createdAtDate.getTimezoneOffset();
    const localCreatedAt = new Date(createdAtDate.getTime() - userTimeZoneOffsetMinutes * 60 * 1000);
    const date = localCreatedAt.toISOString().split('T')[0];

    acc[date] = acc[date] || [];
    acc[date].push(object);
    return acc;
  }, {} as { [date: string]: T[] });

  const sortedDates = Object.keys(groupedObjects).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const sortedGroupedObjects: { [date: string]: T[] } = {};
  sortedDates.forEach(date => {
    sortedGroupedObjects[date] = groupedObjects[date];
  });

  return sortedGroupedObjects;
}