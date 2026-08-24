import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      console.log('searchText:', searchText)
    }, [searchText])

  const searchRepos = async (e: any) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      const response = await axios.get("https://api.github.com/search/repositories", 
        {
          params: {
            q: searchText
          }
        }
      )
      console.log('response:', response)

    } catch (e) {
      console.log('error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={(e)=> searchRepos(e)}>
        <label> Search
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </label>

        <button>Submit</button>
      </form>
    </div>
  )
}

export default App
