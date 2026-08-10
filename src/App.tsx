import { Providers } from "./app/providers"
import { RouterProvider } from "react-router"
import { router } from "./app/router"

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}

export default App
