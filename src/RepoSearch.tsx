
import { useEffect, useState } from 'react'
import axios from 'axios'
import ResultCard from './components/ResultCard/ResultCard'
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

type SearchResult = {
  id: string,
  name: string,
  description: string,
  language: string,
  stargazers_count: number,
  updated_at: string,
  owner: { login: string }
}


const fetchRepos = async ({ query, sort, sortOrder, numItems, page }: {
    query: string;
    sort?: string;
    sortOrder?: string;
    numItems?: number;
    page: number;
}) => {
    const response = await axios.get("https://api.github.com/search/repositories", {
    params: {
        q: query,
        sort: sort || '',
        order: sortOrder || '',
        per_page: numItems || '',
        page: page,
    },
    });
  
  return response.data.items; 
};

export default function RepoSearch () {
    const queryClient = useQueryClient()    // access client

    const [inputValue, setInputValue] = useState('')
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    const [numItems, setNumItems] = useState(30)
    const [page, setPage] = useState(1)


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['repos', query, sort, sortOrder, numItems, page],
        queryFn: () => fetchRepos({ query, sort, sortOrder, numItems, page }),
        enabled: Boolean(query) // prevents initial render fetch if empty query
    })


    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPage(1)
        setQuery(inputValue)    // trigger tanstack query
    }


    return (
        <div className="repo-search">
        <h1>Github Repository Search</h1>
        <p style={{ color: 'red' }}>{error?.message}</p>

        <form onSubmit={handleSubmit} className="repo-search--form">
            <input
                className="repo-search--search-input"
                type="text"
                value={inputValue}
                placeholder="Search"
                onChange={(e) => setInputValue(e.target.value)}
            />

            <div className="repo-search--options">
            <div className="repo-search--option-container">
                <select className="repo-search--select" value={numItems || 30}  onChange={(e) => setNumItems(e.target.value)}>
                { Array.from({ length: 10 }).map((_, index) => { 
                    const item = (index + 1) * 10

                    return (
                    <option key={index} value={item}>{item}</option>
                    )
                })}
                </select>
            </div>

            <div className="repo-search--option-container">
                <select className="repo-search--select" value={sort} onChange={(e)=> setSort(e.target.value)}>
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
            { page > 1 && data.length > 0 && (
                <ChevronLeft 
                    className="clickable" 
                    size={15} 
                    color="black"
                    />
            )}
                <p>Page {page} </p>

                <ChevronRight
                    className="clickable"
                    size={15} 
                    color="black"
                    />
            </div>
        </div>

        { isLoading 
            ? (
            <p>Loading...</p>
            ) : (
            <div>
                { data?.map((result: SearchResult) => (
                <ResultCard 
                    key={result.id}
                    result={result}
                />  
                ))}
            </div>
            )
        }
        </div>
    )
}
