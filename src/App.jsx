import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import {useMovies} from "./useMovies";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "fbbfa667";

export default function App() {
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(() =>
    localStorage.getItem("watched")
      ? JSON.parse(localStorage.getItem("watched"))
      : []
  );
  const {movies,isLoading,error}=useMovies(query,key)

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? "" : id));
  }
  function handleCLoseMovieDetails() {
    setSelectedId("");
  }
  function handleAddWatched(movie) {
    if (!watched.find((m) => m.imdbID === movie.imdbID)) {
      setWatched((watched) => [...watched, movie]);
    }
  }

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);



  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading?<Loader/>: <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              handleSelectMovie={handleSelectMovie}
              handleCLoseMovieDetails={handleCLoseMovieDetails}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              handleCLoseMovieDetails={handleCLoseMovieDetails}
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div className="loader">
      <div className="loader__icon"></div>
      <p className="loader__text">Loading...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠️</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {children}
    </nav>
  );
}
NavBar.propTypes = {
  children: PropTypes.node,
};

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
NumResults.propTypes = {
  movies: PropTypes.array, // Assuming movies is an array
};

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const inputEL=useRef(null)
  useEffect(()=>{
    function focusInput(e){
     if(document.activeElement===inputEL.current) return;

      if(e.code==="Enter"){
         inputEL.current.focus();
         setQuery("")
      }
    }
    document.addEventListener('keydown',focusInput)

    return ()=>{
      document.removeEventListener('keydown',focusInput)
    }
    
  },[setQuery])
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEL}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
Main.propTypes = {
  children: PropTypes.node, // Assuming movies is an array
};

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
Box.propTypes = {
  children: PropTypes.node, // Assuming movies is an array
};
// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MovieList({ movies, handleSelectMovie, handleCLoseMovieDetails }) {
  // const [movies, setMovies] = useState(tempMovieData);
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectMovie={handleSelectMovie}
          handleCLoseMovieDetails={handleCLoseMovieDetails}
        />
      ))}
    </ul>
  );
}
MovieList.propTypes = {
  movies: PropTypes.array, // Assuming movies is an array of objects
};

function Movie({ movie, handleSelectMovie }) {
  return (
    <li onClick={() => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

Movie.propTypes = {
  movie: PropTypes.shape({
    imdbID: PropTypes.string,
    Poster: PropTypes.string,
    Title: PropTypes.string,
    Year: PropTypes.string,
  }),
};

function MovieDetails({ selectedId, handleCLoseMovieDetails, onAddWatched }) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);


  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: runtime.split(" ")[0],
      imdbRating: Number(imdbRating),
      userRating: userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newMovie);
  }

  useEffect(()=>{
    
    if(userRating){
      countRef.current++
    }
  },[userRating])

  useEffect(
    function () {
      function closeDetailsCallback(e) {
        if (e.target.classList.contains("details")||e.code==="Escape") {
          handleCLoseMovieDetails();
        }
      }

      document.addEventListener("keydown", closeDetailsCallback);

      return function () {
        document.removeEventListener("keydown", closeDetailsCallback);
      };
    },
    [handleCLoseMovieDetails]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedId}&apikey=${key}`
        );
        const data = await res.json();
        setMovieDetails(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "userPopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCLoseMovieDetails}>
              &larr;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}&bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating{" "}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>

              <button className="btn-add" onClick={handleAdd}>
                Add to Watched
              </button>
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

WatchedSummary.propTypes = {
  watched: PropTypes.arrayOf(
    PropTypes.shape({
      imdbRating: PropTypes.number,
      userRating: PropTypes.number,
      runtime: PropTypes.number,
    })
  ),
};

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

WatchedMovieList.propTypes = {
  watched: PropTypes.arrayOf(
    PropTypes.shape({
      imdbID: PropTypes.string,
      Poster: PropTypes.string,
      Title: PropTypes.string,
      imdbRating: PropTypes.number,
      userRating: PropTypes.number,
      runtime: PropTypes.number,
    })
  ),
};

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

WatchedMovie.propTypes = {
  movie: PropTypes.shape({
    Poster: PropTypes.string,
    Title: PropTypes.string,
    imdbRating: PropTypes.number,
    userRating: PropTypes.number,
    runtime: PropTypes.number,
  }),
};
