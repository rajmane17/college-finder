import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import RoutingPage from "./components/Routing"

function App() {

  const client = new QueryClient();

  return (
    <>
      <QueryClientProvider client={client}>
        <RoutingPage />
      </QueryClientProvider>
    </>
  )
}

export default App
