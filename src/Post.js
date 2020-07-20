import React from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"

function Post({username, caption, imageURL}) {
    return ( <div className="post">
        <div className="post__header">
            {/* header = avatar+username */}
        <Avatar alt={username} src='/static/images/avatar/1.jpg' className="post__avatar"></Avatar>
    <h3>{username}</h3>
        </div>
       
{/* post */}
<img className="post__image" src={imageURL} alt="" />
<h4 className="post__text"><strong>{username}</strong> {caption}</h4>
        </div>
    )
}

export default Post