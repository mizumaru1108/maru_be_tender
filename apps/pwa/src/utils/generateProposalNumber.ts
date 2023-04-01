export function generateHeader(id: number) {
  const headerValue = `#${id.toString().padStart(12, '0')}`;
  const maxLength = 12;

  if (headerValue.length <= maxLength) {
    return headerValue.toUpperCase();
  } else {
    return headerValue.slice(0, maxLength).toUpperCase();
  }
}
