export function barLabelForPath(pathname: string): string {
  const map: Record<string, string> = {
    "/": "Menu",
    "/services": "Services",
    "/technical-info": "Technical info",
    "/events": "Events",
    "/commissions": "Commissions",
    "/about": "About",
  };
  return (map[pathname] ?? "Menu").toUpperCase();
}
