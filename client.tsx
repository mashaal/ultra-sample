import { hydrateRoot } from "react-dom/client";
import App from "./src/app.tsx";

// Twind
import { sheet, TwindProvider } from "create-ultra-app/twind";
import "./twind.ts";

// Helmet
import { HelmetProvider } from "react-helmet-async";

// React Query
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient.ts";
declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

import { useState } from "react";
import { trpc } from "./src/trpc/client.ts";

function ClientApp() {
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
            <TwindProvider sheet={sheet}>
              <App />
            </TwindProvider>
          </Hydrate>
        </QueryClientProvider>
      </trpc.Provider>
    </HelmetProvider>
  );
}

hydrateRoot(document, <ClientApp />);
