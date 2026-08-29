import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ResultCard from './components/ResultCard/ResultCard'
import { ChevronLeft, ChevronRight } from "lucide-react"

type SearchResult = {
  id: string,
  name: string,
  description: string,
  language: string,
  stargazers_count: number,
  updated_at: string
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [numItems, setNumItems] = useState('')
  const [page, setPage] = useState(1)

  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')



  const changePage = (pageDirection: number) => {
    let newPage = page + pageDirection
    if (newPage < 1 || searchResults.length === 0) return // don't change page if less than 0 or if no search results

    setPage(newPage)
    searchRepos(null, newPage)
  }


  const searchRepos = async (e?: any, pageNumber?: number) => {
    if (e) e.preventDefault()

    if (searchText.trim() === "") {
      setError('Please enter a search term')
      return
    }

    if (!pageNumber) {  // if no page number is passed in, reset page
      setPage(1)
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
            page: pageNumber || 1 
          }
        }
      )

      setSearchResults(response?.data?.items)

    } catch (e) {
      setError('Something went wrong, please try again')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="repo-search">
      <h1>Github Repository Search</h1>
      <p style={{ color: 'red' }}>{error}</p>

      <form onSubmit={(e)=> searchRepos(e)} className="repo-search--form">
          <input
            className="repo-search--search-input"
            type="text"
            value={searchText}
            placeholder="Search"
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

      
      <div className="repo-search--search-results">
        <h3>Search Results</h3>
        <div className="repo-search--page-container">
          { page > 1 && searchResults.length > 0 && (
              <ChevronLeft 
              className="clickable" 
              onClick={() => changePage(-1)}
              size={15} 
              color="black"
            />
          )}
            <p>Page {page} </p>

            <ChevronRight
              onClick={() => changePage(1)}
              className="clickable"
              size={15} 
              color="black"
            />
        </div>
      </div>

      { isLoading && <p>Loading...</p> }

      <div>
        { searchResults.map(result => (
          <ResultCard 
            key={result.id}
            result={result}
          />  
        ))}

      </div>
    </div>
  )
}

export default App
