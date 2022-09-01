import { serve } from "https://deno.land/std@0.153.0/http/server.ts";
import { createRouter, createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

// Twind
import { sheet, TwindProvider } from "create-ultra-app/twind";
import "./twind.ts";

// Wouter
import { Router } from "wouter";
import staticLocationHook from "wouter/static-location";
import { SearchParamsProvider } from "create-ultra-app/wouter";

// Helmet
import { HelmetProvider } from "react-helmet-async";
import useFlushEffects from "ultra/hooks/use-flush-effects.js";
// deno-lint-ignore no-explicit-any
const helmetContext: Record<string, any> = {};

// React Query
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient.ts";

// tRPC
import { useState } from "react";
import { trpc } from "./src/trpc/client.ts";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./src/trpc/router.ts";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

function ServerApp({ context }: any) {
  const [queryClientTrpc] = useState(queryClient);
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8000/trpc",
    })
  );

  useFlushEffects(() => {
    const { helmet } = helmetContext;
    return (
      <>
        {helmet.title.toComponent()}
        {helmet.priority.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.script.toComponent()}
      </>
    );
  });

  const requestUrl = new URL(context.req.url);

  return (
    <HelmetProvider context={helmetContext}>
      <trpc.Provider client={trpcClient} queryClient={queryClientTrpc}>
        <QueryClientProvider client={queryClientTrpc}>
          <TwindProvider sheet={sheet}>
            <Router hook={staticLocationHook(requestUrl.pathname)}>
              <SearchParamsProvider value={requestUrl.searchParams}>
                <App />
              </SearchParamsProvider>
            </Router>
          </TwindProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </HelmetProvider>
  );
}

const trpcServer = createRouter();

trpcServer.get("*", async (context) => {
  return await fetchRequestHandler({
    endpoint: "/trpc",
    req: context.req,
    router: appRouter,
    createContext: () => ({}),
  });
});
server.route("/trpc", trpcServer);

server.get("*", async (context) => {
  queryClient.clear();
  /**
   * Render the request
   */
  const result = await server.render(<ServerApp context={context} />);

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
