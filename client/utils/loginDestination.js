// Only allow the explicitly supported internal return destination.
export function loginDestination() {
  if (typeof window === "undefined") return "/profile";
  return new URLSearchParams(window.location.search).get("next") === "design-studio" ? "/design-studio" : "/profile";
}
