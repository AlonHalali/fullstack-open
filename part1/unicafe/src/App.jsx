import {useState} from 'react'

const StatisticLine = ({text, value}) => <tr>
  <td>{text}</td>
  <td>{value}</td>
  </tr>

const Statistics = ({head, good, neutral, bad}) => {
  const all = good + neutral + bad

  if (all === 0) {
    return (
      <div>
        <h1>{head}</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <h1>{head}</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={average}/>
          <StatisticLine text="positive" value={positive + '%'}/>
        </tbody>
      </table>
      
    </div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

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
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />

      <Statistics head="Statistics" good={good} neutral={neutral} bad={bad}/>      
    </div>
  )
}

export default App