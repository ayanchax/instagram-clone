import React, { useState } from 'react'
import firebase from "firebase";
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';
import db from './firebase';
import storage from './firebase';
import './ImageUpload.css'
function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const handleChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }
    const handleUpload = (event) => {
        const uploadTask = storage.storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // since its asynchronous it might take time to upload so we gonna show progress logic as the image uploads into storage 
                // in a state_changed listener. Meaning as the image continues to upload(state continues to change)mode continue giving me progress snapshots
                // progress function
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(progress)
            }, (error)=>{
                // upload error
                console.log(error)
                alert(error.message)
            },()=>
            {
                //complete storage upload function
                storage.storage.ref("images").child(image.name).getDownloadURL().then((url)=>{
                    //post image url from storage inside db
                    db.db.collection('posts').add({
                        timestamp: new Date(),
                        caption: caption,
                        imageURL: url,
                        username: username
                    })
                    setProgress(0)
                    setCaption("")
                    setImage(null)
                })
               
            })
    }
    return (
        <div className ="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <Input placeholder="caption..." type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload} className="imageupload__button">Upload</Button>

        </div>
    )
}

export default ImageUpload
