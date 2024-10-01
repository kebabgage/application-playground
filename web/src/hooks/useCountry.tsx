import { useCallback, useMemo } from "react";

// Download the icons from here -> https://www.flaticon.com/packs/countrys-flags
const titles = [
  { title: "The Family Cookbook", src: "united-kingdom.png" },
  { title: "The F**** C***book", src: "australia.png" },
  { title: "Familiens Kogebog", src: "denmark.png" },
  { title: "Das Familienkochbuch", src: "germany.png" },
  { title: "Il libro di cucina di famiglia", src: "italy.png" },
];

const getRandomCountry = () => {
  var item = titles[Math.floor(Math.random() * titles.length)];
  return item;
};

export const useCountry = () => {
  const sessionCountry = sessionStorage.getItem("country");

  const country = useMemo(() => {
    if (sessionCountry === null) {
      const randCountry = getRandomCountry();

      // Set in session storage
      sessionStorage.setItem("country", JSON.stringify(randCountry));

      // Set the title
      document.title = randCountry.title;

      return randCountry;
    } else {
      return JSON.parse(sessionCountry);
    }
  }, [sessionCountry]);

  /**
   * Generates a new country
   */
  const setCountry = useCallback(() => {
    const randCountry = getRandomCountry();

    // Set in session storage
    sessionStorage.setItem("country", JSON.stringify(randCountry));

    // Set the title
    document.title = randCountry.title;

    // return randCountry;
  }, []);

  return [country, setCountry];
};
