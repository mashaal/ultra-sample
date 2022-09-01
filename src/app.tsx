import { Suspense } from "react";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import { Link, Route, Switch } from "wouter";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <main>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/about?foo=bar">About: Foo Bar</Link>
          </nav>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/">
                <Home />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route>
                404
              </Route>
            </Switch>
          </Suspense>
        </main>
      </body>
    </html>
  );
}
