const Post = {
    author(parent, args, {db}, info) {
        return db.blogUsers.find((user) => user.id === parent.author)
    },
    comments(parent, args, {db}, info) {
        return db.comments.filter((currentComment) => currentComment.post === parent.id)
    }
}

export default Post