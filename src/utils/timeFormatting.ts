export const formatTimeRange = (timeRange: string) => {
  if (!timeRange) return '';
  
  const [startTime, endTime] = timeRange.split(" to ");
  if (!startTime || !endTime) return timeRange;
  
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  
  const startHour12 = startHour % 12 || 12;
  const startPeriod = startHour >= 12 ? 'pm' : 'am';
  const formattedStart = `${startHour12}:${startMinute?.toString().padStart(2, '0')}`;
  
  const endHour12 = endHour % 12 || 12;
  const endPeriod = endHour >= 12 ? 'pm' : 'am';
  const formattedEnd = `${endHour12}:${endMinute?.toString().padStart(2, '0')}`;
  
  if (startPeriod === endPeriod) {
    return `${formattedStart}-${formattedEnd}${endPeriod}`;
  }
  
  return `${formattedStart}${startPeriod}-${formattedEnd}${endPeriod}`;
};