export function objectToCSV<T extends Record<string, unknown>>(
  data: T[],
): string {
  if (!Array.isArray(data) || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  data.forEach((obj) => {
    const values = headers.map((header) => {
      let value = obj[header];

      // Handle array values by joining with a semicolon
      if (Array.isArray(value)) {
        value = value.join(";");
      }

      // Convert value to string and escape double quotes
      const escaped = String(value ?? "").replace(/"/g, '""');
      return `"${escaped}"`; // Wrap values in double quotes
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
}

export function csvToObject<T = Record<string, unknown>>(csv: string): T[] {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => {
      // Remove surrounding double quotes and unescape inner double quotes
      return value.replace(/^"|"$/g, "").replace(/""/g, '"');
    });

    const obj: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      const value = values[index];

      // Convert semicolon-separated values back to arrays
      obj[header] = value.includes(";") ? value.split(";") : value;
    });

    return obj as T;
  });
}
