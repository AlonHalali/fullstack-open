const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const dbName = 'phonebookApp'
const url = `mongodb+srv://alonhalali:${password}@cluster0.sqbyf8g.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    console.log('phonebook:')

    if (result.length === 0) console.log('No people found!')
    else
      result.forEach((person) => {
        console.log(person.name, person.number)
      })
    mongoose.connection.close()
  })
  return
}
const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number,
})

person.save().then((result) => {
  console.log('added', result.name, 'number', result.number, 'to phonebook')
  mongoose.connection.close()
})
