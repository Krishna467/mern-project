import React, { useState,useEffect } from "react";
import {TextField,Paper,Button,Typography} from "@material-ui/core";
import FileBase from "react-file-base64";
import {useDispatch,useSelector} from "react-redux";

import useStyles from "./styles";
import {createPosts,updatePost} from "../../actions/post";

const Form = ({currentId,setCurrentId}) => {
    const [postData, setPostData] = useState({
        title : '', message : '',tags : '', selectedFile : ''
    });
    const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);

     
    const classes = useStyles();
    const dispatch = useDispatch();

    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if(post) setPostData(post);
    }, [post]);

     const clear = () => {
          setCurrentId(null);
          setPostData({
              title : '', message : '',tags : '', selectedFile : ''
        });
    }

    const handleSubmit = (event) =>{
       
        event.preventDefault();
        if(currentId){
            dispatch(updatePost(currentId, {...postData, name : user?.result?.name}));
            clear();
        }
        else{
            dispatch(createPosts({...postData, name : user?.result?.name}));
            clear();
        }

        
    }

    if(!user?.result?.name){
        return(
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please Sign in to create ypur memoires
                </Typography>
            </Paper>
        )
    }

   

    return (
        <Paper className={classes.paper}>
            <form autoComplete="0ff" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
             <Typography variant="h6">{!currentId ? 'Creating' :  'Editing'} a Memory</Typography>
             <TextField name="title" variant="outlined" label="title" fullWidth value={postData.title} onChange={(e) => setPostData({...postData,title: e.target.value})} />
             <TextField name="message" variant="outlined" label="message" fullWidth multiline rows={4} value={postData.message} onChange={(e) =>  setPostData( {...postData,message: e.target.value})} />
             <TextField name="tags" variant="outlined" label="tags" fullWidth value={postData.tags} onChange={(e) => setPostData({...postData,tags: e.target.value.split(',')})} />
               
            <div className={classes.fileInput}><FileBase type ="file" multiple={false} onDone={({base64}) => setPostData({...postData,selectedFile : base64}) } /></div>
             <Button className={classes.buttonSubmit} variant="contained" color="primary" fullWidth size="large" type="submit">Submit</Button>
             <Button  variant="contained" color="secondary" fullWidth size="small" onClick={clear} >Clear</Button>
          </form>
        </Paper>
    );
}

export default Form;