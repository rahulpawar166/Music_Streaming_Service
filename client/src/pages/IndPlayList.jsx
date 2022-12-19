import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { Link,useParams } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
  Button,
  List,
  ListItem,
  Divider ,
  ListItemText
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "200px",
    width: "200px",
    maxHeight: "200px",
    maxWidth: "200px",
  },
  button: {
    background: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});



const IndPlayList=()=>{
    const [currentData,setCurrentData]=useState()
    const {PlaylistName}=useParams()
    const classes = useStyles();

    const getPlayList = async()=>{

        try {
          console.log("frontend getplaylist function")
          const { data } = await axios.post(
            `http://localhost:3008/playlist/playListData`,{uid:window.localStorage.getItem("currentUser")}
          );
          
          //SET LIST OF ALBBUMS INSIDE PLAYLISTDATA
          data.albums.forEach((element)=> {
            if(element.name === PlaylistName) {
                console.log(element.tracks)
                setCurrentData(element.tracks)
            }
        })
        
        } catch (error) {
          console.log("error", error);
        }
      }

      const deleteTrack=async(trackId)=>{
            try{
                console.log("name of playlist",PlaylistName,trackId)
                const { data } = await axios.post(
                              `http://localhost:3008/playlist/deleteTrack`,{
                                uid:window.localStorage.getItem("currentUser"),  
                                name: PlaylistName,
                                albumId:trackId 
                            })

                        console.log("data after delete",data)

                        data.albums.forEach((element)=> {
                            if(element.name === PlaylistName) {
                                console.log(element.tracks)
                                setCurrentData(element.tracks)
                            }
                        })
            }catch(error){
                console.log(error)
            }
      }


    useEffect(()=>{
        getPlayList()
    },[])

    return(
        <div style={{ maxWidth: '500px' }}>
            <h1>Playlist : {PlaylistName}</h1>
            <List style={{ marginTop: '30px' }}>
                {currentData?.map((element, idx) => (
                   
                        <ListItem key={element?.name}>
                            <ListItemText style={{ maxWidth: '25px' }}>{idx + 1}.</ListItemText>
                            <ListItemText style={{ textAlign: 'start' }} >{element?.name}</ListItemText>
                            <a onClick={()=>deleteTrack(element?.trackId) }>
                                <DeleteIcon/>
                            </a>
                        </ListItem>
                        
                   
                ))}
            </List>
        </div>
    )
}
export default IndPlayList