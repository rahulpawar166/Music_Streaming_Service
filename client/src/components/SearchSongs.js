import React from "react";
import "../styles/App.css"
const SearchSongs = (props) => {
  const handleChange = (e) => {
    props.searchValue(e.target.value);
  };
  return (
    <form
      method="POST "
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name="formName"
      className="center"
    >
      <label>
        <input
          autoComplete="off"
          type="text"
          placeholder="Search Album/ Track/ Artist"
          name="searchTerm"
          onChange={handleChange}
          aria-label="input song"
          className="searchBar"
        />
      </label>
      <br />
      <br />
    </form>
  );
};

export default SearchSongs;
