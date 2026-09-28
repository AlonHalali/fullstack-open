import { useState } from "react";

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  onSubmit,
  name,
  onNameChange,
  number,
  onNumberChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={name} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={number} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = ({ person }) => {
  return (
    <p>
      {person.name} {person.number}
    </p>
  );
};

const Persons = ({ persons }) => {
  return (
    <>
      {persons.map((person) => (
        <Person key={person.id} person={person} />
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [newFilter, setFilter] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name.trim() === newName.trim())) {
      window.alert(`${newName} is already added to phonebook!`);
    } else if (!newName.trim()) {
      window.alert(`name is empty!`);
    } else if (!newNumber.trim()) {
      window.alert(`number is empty!`);
    } else {
      setPersons(
        persons.concat({
          name: newName,
          number: newNumber,
          id: crypto.randomUUID(),
        }),
      );

      setName("");
      setNumber("");
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = newFilter
    ? persons.filter((person) =>
        person.name
          .trim()
          .toLowerCase()
          .includes(newFilter.trim().toLowerCase()),
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={newFilter} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleSubmit}
        name={newName}
        onNameChange={handleNameChange}
        number={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;
