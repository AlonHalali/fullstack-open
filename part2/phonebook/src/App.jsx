import { useEffect, useState } from "react";
import personService from "./services/persons";
import SuccessfulNotification from "./components/Notification";

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

const Person = ({ person, onClick }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={onClick}>delete</button>
    </p>
  );
};

const Persons = ({ persons, onDeletePerson }) => {
  return (
    <>
      {persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          onClick={() => onDeletePerson(person)}
        />
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [newFilter, setFilter] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = newName.trim();
    const number = newNumber.trim();

    if (!name) {
      window.alert(`name is empty!`);
      return;
    }
    if (!number) {
      window.alert(`number is empty!`);
      return;
    }

    const personFound = persons.find((p) => p.name.trim() === name);

    if (personFound) {
      const newPerson = { ...personFound, number: number };

      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        personService
          .update(newPerson.id, newPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id === returnedPerson.id ? returnedPerson : p,
              ),
            );

            setSuccessfulMessage(
              `${returnedPerson.name}'s number changed to ${returnedPerson.number}`,
            );

            setTimeout(() => {
              setSuccessfulMessage(null);
            }, 5000);

            setName("");
            setNumber("");
          })
          .catch((error) => {
            alert(
              `Information of ${newPerson.name} has already been removed from server`,
            );
            setPersons(persons.filter((p) => p.id !== newPerson.id));
          });
      }
    } else {
      const newPerson = { name: name, number: number };

      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setSuccessfulMessage(`Add ${returnedPerson.name}`);

        setTimeout(() => {
          setSuccessfulMessage(null);
        }, 5000);
        setName("");
        setNumber("");
      });
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

  const handleDeletePerson = (personToDelete) => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .remove(personToDelete.id)
        .then(() => {
          setPersons(
            persons.filter((person) => person.id !== personToDelete.id),
          );
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            alert(
              `Information of ${personToDelete.name} has already been removed from server`,
            );
            setPersons(
              persons.filter((person) => person.id !== personToDelete.id),
            );
          } else {
            alert(`Failed to delete ${personToDelete.name}. Server error.`);
          }
        });
    }
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
      <SuccessfulNotification message={successfulMessage} />
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
      <Persons persons={personsToShow} onDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
