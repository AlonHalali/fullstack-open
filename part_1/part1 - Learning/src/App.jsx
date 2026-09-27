const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const friends = [1, 2 ,3 ]
  return (
    <div>
      <h1>{friends}</h1>
      <Hello name="Bob" age={18}/>
    </div>
  )
}

export default App