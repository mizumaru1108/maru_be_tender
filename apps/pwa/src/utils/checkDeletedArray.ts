export function getMissingItems(mainArray: any[], secondaryArray: any[]) {
  // Mengambil seluruh ID dari secondaryArray
  const secondaryIds = secondaryArray.map((item) => item.id);

  // Mengembalikan elemen dari mainArray yang ID-nya tidak ada di secondaryIds
  return mainArray.filter((item) => !secondaryIds.includes(item.id));
}
