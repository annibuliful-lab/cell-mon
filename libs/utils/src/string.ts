export function transformToSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function padString(n: string, width: number, z = '0') {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function extractMccMncFromImsi(
  imsi: string,
): { mcc: string; mnc: string } | null {
  const pattern = /^(\d{3})(\d{2,3})\d+$/;
  const match = imsi.match(pattern);

  if (match) {
    const mcc = match[1];
    const mnc = match[2];
    return { mcc, mnc };
  }

  return null;
}

export function isValidIMSI(imsi: string) {
  const isNumeric = /^\d+$/;
  if (!isNumeric.test(imsi) || imsi.length !== 15) {
    return false;
  }

  return true;
}

export function generateRandomIMSI() {
  let imsi = '';

  for (let i = 0; i < 15; i++) {
    // Generate a random digit (0-9) and append to the IMSI
    imsi += Math.floor(Math.random() * 10);
  }

  return imsi;
}
