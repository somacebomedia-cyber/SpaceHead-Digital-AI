import { renderToString } from "react-dom/server";
import App from "./App";

export function render(initialPath = "/") {
  const html = renderToString(<App initialPath={initialPath} />);
  return { html };
}
