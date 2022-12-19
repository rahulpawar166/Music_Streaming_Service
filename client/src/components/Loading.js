import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const Loading = () => {
  return (
    <Backdrop sx={{ color: "#fff", zIndex: 999 }} open={true}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default Loading;
