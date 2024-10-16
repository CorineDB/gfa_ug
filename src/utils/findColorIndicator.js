export function getColorForValue(value) {
  const intervals = [
    { limit: 0.25, color: "rgb(239 68 68 )" },
    { limit: 0.5, color: "rgb(127 29 29)" },
    { limit: 0.75, color: "rgb(234 179 8 )" },
    { limit: 1, color: "rgb(22 163 74 )" },
  ];

  for (const interval of intervals) {
    if (value <= interval.limit) {
      return interval.color;
    }
  }

  return "";
}
