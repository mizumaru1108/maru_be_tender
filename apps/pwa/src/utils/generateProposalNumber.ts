export function generateHeader(id: number) {
  const headerValue = `#${id.toString().padStart(9, '0')}`;
  const maxLength = 10;

  if (headerValue.length <= maxLength) {
    return headerValue.toUpperCase();
  } else {
    return headerValue.slice(0, maxLength).toUpperCase();
  }
}
