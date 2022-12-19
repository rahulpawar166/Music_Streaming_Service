import React from "react";

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
        <span>Search: </span>
        <input
          autoComplete="off"
          type="text"
          placeholder="Enter.."
          name="searchTerm"
          onChange={handleChange}
          aria-label="input song"
        />
      </label>
      <br />
      <br />
    </form>
  );
};

export default SearchSongs;
