// import React from "react";
// import generateToken, { isTokenValid } from "../generateToken";

// //CREATE TOKEN TO GET DATA FROM DIFFERENT MEHTODS OF SPOTIFY API
// const getToken = async () =>
//   window.localStorage.setItem("token", JSON.stringify(await generateToken()));

// export const deleteToken = () => {
//   window.localStorage.removeItem("token");
// };

// export const AuthProvider = (props) => {
//   // componentDidMount and componentDidUpdate
//   React.useEffect(() => {
//     getToken();

//     // componentDidUnmount
//     return deleteToken;
//   }, []);

//   if (!isTokenValid(JSON.parse(window.localStorage.getItem("token"))?.expires_in)
//   ) {
//     return (
//       <React.Fragment>{"Unauthorized! Please click to login"}</React.Fragment>
//     );
//   }

//   return props.children;
// };
