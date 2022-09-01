import { hydrateRoot } from "react-dom/client";
import App from "./src/app.tsx";

// Twind
import { ThemeProvider } from "./src/theme.tsx";

// Helmet
import { HelmetProvider } from "react-helmet-async";

// React Query
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/queryClient.ts";
import { useDehydrateReactQuery } from "./src/hooks/useDehydrateReactQuery.tsx";
declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

import { useState } from "react";
import { trpc } from "./src/trpc/client.ts";

function ClientApp() {
  useDehydrateReactQuery(queryClient);
  // tRPC
  const [queryClientTrpc] = useState(queryClient);
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8000/trpc",
    })
  );

  return (
    <HelmetProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClientTrpc}>
        <QueryClientProvider client={queryClientTrpc}>
          <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </trpc.Provider>
    </HelmetProvider>
  );
}

hydrateRoot(document, <ClientApp />);
