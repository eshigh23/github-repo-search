import './ResultCard.css'

type ResultCardProps = {
    result: {
        name: string,
        description: string,
        language: string,
        stargazers_count: number,
        updated_at: string
    }
}

export default function ResultCard({ result }: ResultCardProps) {

    // had to look this up as well, unsure about the timezone argument
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)  
        let formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        
        return formattedDate
    }

    return (
         <div className="result-card">
            <p className="result-card--title">{result.name}</p>
            <p className="result-card--description">{result.description}</p>
            <div className="result-card--subtext-container">
                <p className="result-card--subtext">{result.language}</p>
                <p className="result-card--subtext">・</p>
                <p className="result-card--subtext">{result.stargazers_count}</p>
                <p className="result-card--subtext">・</p>
                <p className="result-card--subtext">Updated on {formatDate(result.updated_at)}</p>
            </div>
           
          </div>
    )
}