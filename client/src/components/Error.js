import Typography from "@mui/material/Typography";

const Error = (props) => {
  let errorMessage =
    props.message ||
    "Error 500: Something went wrong, we're not sure what. Try refreshing the page?";
  return <Typography variant="h2">{errorMessage}</Typography>;
};

export default Error;
