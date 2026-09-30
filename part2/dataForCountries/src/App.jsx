import { useState, useEffect } from "react";
import countriesService from "./services/countries";

const Country = ({ name }) => (
  <>
    {name}
    <br />
  </>
);

const CountriesDisplay = ({ countries }) => {
  if (countries === null) return null;

  const countriesLength = countries.length;

  if (countriesLength === 0) {
    return <div>No match found!</div>;
  }

  if (countriesLength > 10) {
    return <div>Too many matches, specify another filter!</div>;
  }

  if (countriesLength >= 2) {
    return (
      <div>
        {countries.map((country, i) => (
          <Country key={country.cca3} name={country.name.common} />
        ))}
      </div>
    );
  }

  const country = countries[0];
  console.log(country);

  return (
    <div>
      <h1>{country.name.common}</h1>
      Capital {country.capital?.join(", ")}
      <br />
      Area {country.area}
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages || {}).map(([code, name]) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common}'s flag`} />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    countriesService
      .getAll()
      .then((initialCountries) => setCountries(initialCountries))
      .catch(() => alert("error fetching countries!"));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const countriesToShow =
    filter.trim().length === 0
      ? null
      : countries.filter((country) =>
          country.name.common
            .toLowerCase()
            .includes(filter.trim().toLowerCase()),
        );

  return (
    <div>
      find countries{" "}
      <input type="text" value={filter} onChange={handleFilterChange} />
      <CountriesDisplay countries={countriesToShow} />
    </div>
  );
};

export default App;
