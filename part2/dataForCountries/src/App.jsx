import { useState, useEffect } from "react";
import countriesService from "./services/countries";

const FullCountry = ({ country }) => (
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

const Country = ({ name, onClick }) => (
  <>
    {name} <button onClick={onClick}>Show</button>
    <br />
  </>
);

const CountriesDisplay = ({ countries, handleShowClick }) => {
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
          <Country
            key={country.cca3}
            name={country.name.common}
            onClick={() => handleShowClick(country)}
          />
        ))}
      </div>
    );
  }

  const country = countries[0];

  return <FullCountry country={country} />;
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [countrySelected, setCountrySelected] = useState(null);

  useEffect(() => {
    countriesService
      .getAll()
      .then((initialCountries) => setCountries(initialCountries))
      .catch(() => alert("error fetching countries!"));
  }, []);

  const handleFilterChange = (event) => {
    setCountrySelected(null);
    setFilter(event.target.value);
  };

  const handleShowClick = (country) => {
    setCountrySelected(country);
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
      {countrySelected !== null ? (
        <FullCountry country={countrySelected} />
      ) : (
        <CountriesDisplay
          countries={countriesToShow}
          handleShowClick={handleShowClick}
        />
      )}
    </div>
  );
};

export default App;
