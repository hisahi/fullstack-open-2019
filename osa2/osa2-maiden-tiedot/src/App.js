import React, { useState, useEffect } from 'react'
import axios from 'axios'

const FilterSearch = ({ searchField, updateSearch }) => (
  <>
    find countries <input value={searchField} onChange={updateSearch} />
  </>
)

const CountryList = ({ countries, doSearch }) => {
  if (countries === null) {
    return null;
  }
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (countries.length < 1) {
    return <p>No matches</p>;
  }

  return (<ul>
    { countries.map(country => <li key={country.name}>{country.name} <button type="button" onClick={() => doSearch(country.name)}>show</button></li>) }
  </ul>);
}

const CountryInfo = ({ country }) => {
  if (country == null) {
    return null
  }

  return <div>
    <h1>{country.name}</h1>
    <p>Capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <p>Area (km^2): {country.area}</p>
    <h2>Languages</h2>
    <ul>
      {country.languages.map(lang => <li key={lang.iso639_2}>{lang.name}</li>)}
    </ul>
    <img alt={`Flag of ${country.name}`} style={{maxHeight: "400px"}} src={country.flag} />
  </div>
}

const WeatherData = ({ weather }) => {
  if (weather == null) {
    return null
  }

  const { location, current } = weather

  return (<div>
    <h2>Weather in {location.name}</h2>
    <p><b>temperature</b>: {current.temp_c} Celsius</p>
    <img alt={current.condition.text} src={current.condition.icon} />
    <p><b>wind</b>: {current.wind_kph} km/h direction {current.wind_dir}</p>
  </div>)
}

const App = () => {
  const [ countryData, setCountryData ] = useState({})
  const [ filterSearch, setFilterSearch ] = useState('')
  const [ countryList, setCountryList ] = useState(null)
  const [ oneCountry, setOneCountry ] = useState(null)
  const [ weatherData, setWeatherData ] = useState(null)

  const doSearch = filter => {
    setFilterSearch(filter)
    if (filter.length < 1) {
      setCountryList(null)
      setOneCountry(null)
    } else {
      const countryList = countryData.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
      const exactCountry = (
              (countryList.length === 1 && countryList[0]) ||
              countryData.find(country => filter.toLowerCase() === country.name.toLowerCase()))
      if (exactCountry) {
        setCountryList(null)
        setOneCountry(exactCountry)
        if (process.env.APIXU_API_KEY) {
          axios
            .get(`http://api.apixu.com/v1/current.json?key=${process.env.APIXU_API_KEY}&q=${exactCountry.capital}%2C+${exactCountry.name}`)
            .then(response => setWeatherData(response.data))
        } else {
          setWeatherData(null)
        }
      } else {
        setCountryList(countryList)
        setOneCountry(null)
        setWeatherData(null)
      }
    }
  }

  const updateSearch = event => {
    doSearch(event.target.value)
  }

  useEffect(() => {
    if (!process.env.APIXU_API_KEY) {
      console.warn("No Apixu API key specified through env, weather not available.")
    }
  }, []);

  useEffect(() => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then(response => {
        setCountryData(response.data)
      })
  }, []);

  return (
    <div>
      <FilterSearch searchField={filterSearch} updateSearch={updateSearch} />
      <CountryList countries={countryList} doSearch={doSearch} />
      <CountryInfo country={oneCountry} />
      <WeatherData weather={weatherData} />
    </div>
  )
}

export default App
