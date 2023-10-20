import { useState,useEffect } from "react";

export function useMovies(query,key){
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(
        function () {
            
          const controller = new AbortController();
    
          async function fetchData() {
            try {
              setIsLoading(true);
              setError("");
              const res = await fetch(
                `http://www.omdbapi.com/?s=${query}&apikey=${key}`,
                { signal: controller.signal }
              );
    
              if (!res.ok) {
                throw new Error("Something went wrong with the request");
              }
              const data = await res.json();
              if (data.Response === "False") {
                throw new Error(data.Error);
              }
              setMovies(data.Search);
              setError("");
            } catch (err) {
              if (err.name !== "AbortError") {
                setError(err.message);
              }
            } finally {
              setIsLoading(false);
            }
          }
    
          if (query.length < 3) {
            setMovies([]);
            return;
          } else {
            fetchData();
          }
    
          return function () {
            controller.abort();
          };
        },
        [query,key]
      );

        return {movies, isLoading, error};
}