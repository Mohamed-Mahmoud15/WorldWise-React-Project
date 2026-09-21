import styles from "./CountryItem.module.css";
export default function CountryItem({ country }) {
  const flagUrl = `https://flagcdn.com/w40/${country.countryCode.toLowerCase()}.png`;

  console.log("Country:", country.country);
  console.log("Code:", country.countryCode);
  console.log("Flag URL:", flagUrl);

  return (
    <li className={styles.countryItem}>
      <span>
        <img src={flagUrl} alt={`${country.country} flag`} />
      </span>

      <span>{country.country}</span>
    </li>
  );
}
