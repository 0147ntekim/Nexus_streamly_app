import { useSearchParams } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import SearchResults from "../components/movies/SearchResults.jsx";
import BrowseCategories from "../components/movies/BrowseCategories.jsx";

function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  function handleSearch(value) {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  }

  return (
    <Container>
      <Section title="Browse movies">
        <SearchBar onSearch={handleSearch} initialValue={query} />
      </Section>

      {query ? <SearchResults query={query} /> : <BrowseCategories />}
    </Container>
  );
}

export default Browse;