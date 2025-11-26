export const formatPlate = (plate: string): string => {
  return plate.toUpperCase().trim();
};

export const isValidPlate = (plate: string): boolean => {
  const formatted = formatPlate(plate);
  return formatted.length === 7 && /^[A-Z0-9]+$/.test(formatted);
};

export const formatDuration = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}min`;
};

export const calculateStayDuration = (entryTime: Date): string => {
  const durationMs = Date.now() - entryTime.getTime();
  return formatDuration(durationMs);
};

export const generateSpaceId = (index: number): string => {
  const SPACES_PER_SECTION = 20;
  const FIRST_SECTION_CHAR_CODE = 65; // 'A'
  
  const section = String.fromCharCode(
    FIRST_SECTION_CHAR_CODE + Math.floor((index - 1) / SPACES_PER_SECTION)
  );
  const number = ((index - 1) % SPACES_PER_SECTION) + 1;
  return `${section}${String(number).padStart(2, '0')}`;
};

export const generateRandomPlate = (excludePlates: string[] = []): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  
  const randomChar = (source: string) => 
    source.charAt(Math.floor(Math.random() * source.length));
  
  let plate: string;
  do {
    plate = `${randomChar(letters)}${randomChar(letters)}${randomChar(letters)}${randomChar(digits)}${randomChar(letters)}${randomChar(digits)}${randomChar(digits)}`;
  } while (excludePlates.includes(plate));
  
  return plate;
};
