import { useEffect, useState } from "react";

import styles from "./Form.module.css";

import Button from "./Button";

import BackButton from "./BackButton";

import { UseUrlPosition } from "../Hooks/UseUrlPosition";

import Message from "./Message";

import Spinner from "./Spinner";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = UseUrlPosition();

  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchUrlData() {
        try {
          setIsLoadingGeo(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
          );
          setGeoCodingError("");
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city,Click Somewhere Else 😊",
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setCountryCode(data.countryCode);
        } catch (err) {
          setGeoCodingError(err.message);
        } finally {
          setIsLoadingGeo(false);
        }
      }

      fetchUrlData();
    },
    [lat, lng],
  );
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      countryCode,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }
  if (isLoadingGeo) return <Spinner />;
  if (!lat && !lng)
    return <Message message="Start By Click On Somewhere on the map" />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>

        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />

        {countryCode && (
          <img
            className={styles.flag}
            src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
            alt={`${country} flag`}
          />
        )}
      </div>

      <div className={styles.row}>
        <label htmlFor="cityName">When did you go to {cityName}?</label>

        <input
          id="cityName"
          onChange={(e) => setDate(e.target.value)}
          value={cityName}
        />
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>

        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
