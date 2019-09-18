const User = {
    posts(parent, args, {db}, info) {
        return db.posts.filter((currentPost) => currentPost.author === parent.id)
    },
    comments(parent, args, {db}, info) {
        return db.comments.filter((currentComment) => currentComment.author === parent.id)
    }
}

export default User