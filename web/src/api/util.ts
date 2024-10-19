export function getHost(): string {
  if (process.env.NODE_ENV === "production") {
    return `http://${window.location.host}/api`;
  } else {
    return "http://localhost:8000";
  }
}
