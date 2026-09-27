import {useState} from 'react'

const Statistics = ({head, good, neutral, bad}) => {
  const all = good + neutral + bad
  return <>
    <h1>{head}</h1>
    <p>good {good}</p>
    <p>neutral {neutral}</p>
    <p>bad {bad}</p>

    <p>all {all}</p>
    <p>average {all === 0 ? 0 : (good - bad) / all}</p>
    <p>positive: {all === 0 ? 0 : ((good)/(all))*100}%</p>
  </>
}

const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  

  return (
    <div>
      <h1>Give feedback</h1>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>

      <Statistics head="Statistics" good={good} neutral={neutral} bad={bad}/>      
    </div>
  )
}

export default App