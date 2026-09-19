import './App.css'
import RepoSearch from './RepoSearch'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RepoSearch />
    </QueryClientProvider>
  )
}

export default App