export const formatTimeRange = (startTime: string, endTime: string) => {
  // Return early if either time is missing
  if (!startTime || !endTime) {
    return '';
  }

  // Handle the case where the input is already in the format "HH:MM to HH:MM"
  if (startTime.includes(' to ')) {
    const [start, end] = startTime.split(' to ');
    return formatTimeRange(start, end);
  }

  // Convert times to Date objects for easier manipulation
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  
  // Validate parsed values
  if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
    return startTime; // Return original value if parsing fails
  }
  
  // Format start time
  const startHour12 = startHour % 12 || 12;
  const startPeriod = startHour >= 12 ? 'pm' : 'am';
  const formattedStart = `${startHour12}:${startMinute.toString().padStart(2, '0')}`;
  
  // Format end time
  const endHour12 = endHour % 12 || 12;
  const endPeriod = endHour >= 12 ? 'pm' : 'am';
  const formattedEnd = `${endHour12}:${endMinute.toString().padStart(2, '0')}`;
  
  // If periods are the same, only show it once at the end
  if (startPeriod === endPeriod) {
    return `${formattedStart}-${formattedEnd}${endPeriod}`;
  }
  
  // If periods are different, show both
  return `${formattedStart}${startPeriod}-${formattedEnd}${endPeriod}`;
};