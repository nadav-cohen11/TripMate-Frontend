import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { whiteSelect } from '../../styles/selectStyles';

const CountryAndCitySelect = ({ form, setForm, errors, setErrors }) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(r => r.json())
      .then(({ data }) =>
        setCountryOptions(
          data.map(c => ({ value: c.name, label: c.name }))
              .sort((a, b) => a.label.localeCompare(b.label))
        )
      )
      .catch(err => { console.error(err); toast.error("Failed to load countries"); });
  }, []);

  const loadCities = async country => {
    if (!country) return setCityOptions([]);
    setLoadingCities(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      const { data = [] } = await res.json();
      setCityOptions(
        data.sort((a, b) => a.localeCompare(b))
            .map(n => ({ value: n, label: n }))
      );
    } catch (err) {
      console.error(err);
      setCityOptions([]);
      toast.error("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <Select
        placeholder="Country"
        options={countryOptions}
        value={countryOptions.find(o => o.value === form.country) || null}
        onChange={o => {
          try {
            setForm(f => ({ ...f, country: o?.value || "", location: "" }));
            loadCities(o?.value);
            if (errors.country) {
              setErrors(prev => ({ ...prev, country: null }));
            }
          } catch (error) {
            console.error("Country selection error:", error);
            toast.error("An error occurred while selecting country");
          }
        }}
        isSearchable
        styles={whiteSelect}
      />
      {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

      <Select
        placeholder={loadingCities ? "Loading cities…" : "City"}
        options={cityOptions}
        value={cityOptions.find(o => o.value === form.location) || null}
        onChange={o => {
          try {
            setForm(f => ({ ...f, location: o?.value || "" }));
            if (errors.location) {
              setErrors(prev => ({ ...prev, location: null }));
            }
          } catch (error) {
            console.error("City selection error:", error);
            toast.error("An error occurred while selecting city");
          }
        }}
        isSearchable
        isDisabled={!form.country || loadingCities}
        styles={whiteSelect}
      />
      {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
    </section>
  );
};

export default CountryAndCitySelect; 