import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import Input from '@material-ui/core/Input';
import db from './firebase';
import firebase from "firebase"
function Post({ postId, user, username, caption, imageURL }) {
    // list of comments display for each post
    const [comments, setComments] = useState([])
    // signle comment for user comment carrier
    const [comment, setComment] = useState('')
    const postComment = (event) => {
        event.preventDefault();
        db.db.collection('posts').doc(postId).collection('comments').add({
            comment: comment,
            username: user.displayName, 
            timestamp: new Date(),
        })
        setComment('')
    }
    useEffect(() => {
        let unsubscribe;
        //backend listener
        if (postId) {
            unsubscribe = db.db.collection('posts').doc(postId).collection('comments').orderBy('timestamp','desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data())) //anytime a new comment is added/deleted/edited(page is refreshed) for a specific post id, this useEffect Backend listener runs and updates the comments state
            })
        }
        return () => {
            unsubscribe();
        }

    }, [postId])
    return (<div className="post">
        <div className="post__header">
            {/* header = avatar+username */}
            <Avatar alt={username} src='/static/images/avatar/1.jpg' className="post__avatar"></Avatar>
            <h3>{username}</h3>
        </div>

        {/* post */}
        <img className="post__image" src={imageURL} alt="" />
        <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
        <div className="post__comments">
            {
                comments.map((cmnt) =>
                    (
                        <p><b>{cmnt.username}</b> {cmnt.comment}</p>
                    ))
            }
        </div>
        {
            user && (
                <form className="post__commentbox">
                <input className="post__input" type="text" placeholder="Add a comment.." value={comment} onChange={(e) => setComment(e.target.value)} />
                <button disabled={!comment} className="post__button" type="submit" onClick={postComment}>Post</button>
            </form>  
            )
        }
     
       
    </div>
    )
}

export default Post