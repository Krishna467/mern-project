import React, { useState } from 'react';
import {Avatar,Button,Typography,Paper,Grid,Container} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {GoogleLogin} from "react-google-login";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import useStyles from "./styles";
import Input from './input';
import Icon from "./icon";
import {signin,signup} from "../../actions/auth";


const initialState = {firstName : '' , lastName : '', email : '',password : '', confirmPassword : ''};

const Auth = () => {
    const classes = useStyles();
    const [isSignup,setSignup] = useState(false);
    const [showPassword , setShowPassword] = useState(false);
    const [formData,setFormData] = useState(initialState);


    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        if(isSignup){
            dispatch(signup(formData,history));
        }
        else{
            dispatch(signin(formData,history));
        }
    }

    const handleChange = (e) => {
       setFormData({...formData,[e.target.name] : e.target.value});
    }

    const handleShowPass =() => setShowPassword((prevShowPassword) => !prevShowPassword);

    const switchMode = () => {
        setSignup((prevSignup) => !prevSignup);
        setShowPassword(false);
    };

    const googleSuccess = (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        
        try {
            dispatch({type : 'AUTH' ,data : {result,token}});

            history.push('/');
        } catch (error) {
            
        }

    }

    const googleFailure = () => {
        console.log("Google sign in failed");
    }

    return (
        <Container component="main" maxWidth="xs">
         <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In' }</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid spacing={2} container>
                    {isSignup && (
                        <>
                         <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                         <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                        </>
                    )}
                    <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password' } handleShowPass={handleShowPass} />
                    {isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type={showPassword ? 'text' : 'password' } handleShowPass={handleShowPass} />}
                </Grid>
                <Button variant="contained" fullWidth type="submit" color="primary" className={classes.submit}>
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Button>
                <GoogleLogin
                     clientId="21868689756-htrbkl49s76q92pr2o3c1dml8f8eovsn.apps.googleusercontent.com"
                     render={(renderProps) => (
                         <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} variant="contained" startIcon={<Icon />}>
                           Google Sign In                        
                         </Button>
                     )}
                     onSuccess={googleSuccess}
                     onFailure={googleFailure}
                     cookiePolicy="single_host_origin"
                      />
                <Grid container justify="flex-end">
                    <Grid item>
                        <Button onClick={switchMode}>
                            {isSignup ? 'Already Have an account? Sign In' : "Don't have an account? Sign Up"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
         </Paper>
        </Container>
            )
}

export default Auth
