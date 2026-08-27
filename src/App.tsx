import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

type SearchResult = {
  id: string,
  name: string,
  description: string,
  language: string,
  stargazers_count: number,
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [numItems, setNumItems] = useState('')

  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')


  useEffect(() => {
    console.log('sortOption:', sortOption)
  }, [sortOption])


  useEffect(() => {
    console.log('numItems:', numItems)
  }, [numItems])


  const searchRepos = async (e: any) => {
    e.preventDefault()

    if (searchText.trim() === "") {
      setError('Please enter a search term')
      return
    }
    
    setError('')

    try {
      setIsLoading(true)
      const response = await axios.get("https://api.github.com/search/repositories", 
        {
          params: {
            q: searchText,
            sort: sortOption ? sortOption : '',
            order: sortOrder ? sortOrder : '',
            per_page: numItems ? numItems : '',

          }
        }
      )
      console.log('response:', response)
      setSearchResults(response?.data?.items)

    } catch (e) {
      console.log('error:', e)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="repo-search">
      <p style={{ color: 'red' }}>{error}</p>

      <form onSubmit={(e)=> searchRepos(e)} className="repo-search--form">
          <input
            className="repo-search--search-input"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

        <div className="repo-search--options">
          <div className="repo-search--option-container">
            <select className="repo-search--select" value={numItems || 30}  onChange={(e) => setNumItems(e.target.value)}>
              { Array.from({ length: 10 }).map((_, index) => {  // had to look up this syntax
                const item = (index + 1) * 10

                return (
                  <option key={index} value={item}>{item}</option>
                )
            })}
            </select>
          </div>

          <div className="repo-search--option-container">
            <select className="repo-search--select" value={sortOption} onChange={(e)=> setSortOption(e.target.value)}>
              <option value="">Best match</option>
              <option value="stars">Stars</option>
              <option value="updated">Recently updated</option>
            </select>
          </div>

          <div className="repo-search--option-container">
            <select className="repo-search--select" value={sortOrder} onChange={(e)=> setSortOrder(e.target.value)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <button className="repo-search--submit">Submit</button>
      </form>


      <h3>Search Results</h3>
      <div>
        { searchResults.map(result => (
          <div key={result.id}>
            <p>{result.name}</p>
            <p>{result.description}</p>
            {/* <p>tags</p> */}
            <p>{result.language}</p>
            <p>{result.stargazers_count}</p>
            {/* <p>{result.updated_at}</p> */}
          </div>
        ))}
      </div>

    </div>
  )
}

export default App
