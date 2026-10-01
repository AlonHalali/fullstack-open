const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<div>Hello to Persons</div>");
});

app.get("/info", (request, response) => {
  const date = new Date();
  const returnDiv = `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    </div>
  `;

  response.send(returnDiv);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (!person) return response.status(404).end();

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const max = 1000000;
  return String(Math.floor(Math.random() * max));
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number)
    return response.status(400).json({ error: "missing params" });

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.status(201).json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
