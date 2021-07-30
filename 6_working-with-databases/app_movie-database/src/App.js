import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hoisting makes that all "const" statements are processed
  // at the beginning, therefore useEffect needs to be moved
  // after "const fetchMoviesHandler ..."
  // and NOT like before can stay before it
  // when the normal function() syntax is used
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Clear previous error
    try {
      const response = await fetch(
        "https://react-http-45506-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      // Change how data is accessed based on firebase!!!
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []); // state updating functions (e.g. setError) don't need to be included
  // because they are automatically added by react

  // HTTP requests is a side-effect that may change component state
  // Such side-effect should go into useEffect
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]); // only runes for the first time

  // The fetch() function also allows to POST data!!!
  // method is by default get
  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://react-http-45506-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie), // add resources to store (takes a JS object and turns it into a json)
        headers: {
          "Content-Type": "application/json", // a lot of API requests might require to state the content that will be send
        },
      }
    );

    const data = await response.json();
    console.log(data);
  };

  let content = <p>Found no movies</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Data is loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
