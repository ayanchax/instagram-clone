import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import db from './firebase';
import auth from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null)

  //auth useEffect: front end listener : this is called whenever a user in system logs in or out
  // also takes care of displaying the correct display name
  useEffect(() => {
    //backend listener
    const userActivityListener = auth.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        console.log(authUser)
        setUser(authUser);
      }
      else {
        //user logged out
        setUser(null)
      }
    })
    return () => {
      //perform clean up action and detach user activity listener and restart listener
      userActivityListener();
    }
  }, [user, username])
  // db useEffect : front end listener : Runs a piece of code based on a specific condition or when the data in page changes every time
  useEffect(() => {
    // backend listener: this is run whenever there is a change in the firebase collection/documents
    db.db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => (
        {
          id: doc.id,
          post: doc.data()
        })))
    })
  }, [])
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSignIn = () => {
    setOpenSignIn(false)
  }
  const signUp = (event) => {
    event.preventDefault();
    auth.auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
      setOpen(false)
      return authUser.user.updateProfile({
        displayName: username
      })
    }).catch((error) => alert(error.message));
  }
  const signIn = (event) => {
    event.preventDefault();
    auth.auth.signInWithEmailAndPassword(email, password).then((authUser) => { setOpenSignIn(false) }).catch((error) => alert(error.message))
  }
  const openSignInForm = (event) => {
    event.preventDefault();
    setOpenSignIn(true);
    setPassword('')
    setEmail('')
  }
  const openSignupForm = (event) => {
    event.preventDefault();
    setOpen(true);
    setUsername('')
    setPassword('')
    setEmail('')
  }
  return (<div className="App" >
    {/* 
     caption input
     file picker
     post button
     */}
     
    {/* REGISTER/SIGN UP MODAL */}
    <Modal
      open={open}
      onClose={handleClose}>
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <div className="app__header">
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
            </div>
          </center>
          <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
      </div>
    </Modal>
    {/* SIGN IN MODAL */}
    <Modal
      open={openSignIn}
      onClose={handleCloseSignIn}>
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signin">
          <center>
            <div className="app__header">
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
            </div>
          </center>
          <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>
      </div>
    </Modal>
    {/* Header*/}
    <div className="app__header">
      <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
    </div>

    {/* LOGIN/REGISTER/SIGNOUT BUTTON */}
    {
      user ? (
        <Button onClick={() => { auth.auth.signOut() }}>Logout</Button>
      ) : (
          <div className="app__loginContainer">
            <Button onClick={openSignInForm}>Sign In</Button>

            <Button onClick={openSignupForm}>Sign Up</Button>

          </div>

        )
    }

    {/* POSTS*/}
    {
      posts.map(({ id, post }) => (
        <Post key={id} username={post.username} caption={post.caption} imageURL={post.imageURL} />
      ))
    }
  </div>
  );
}

export default App;