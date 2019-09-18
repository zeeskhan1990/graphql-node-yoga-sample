import uuid from "uuid/v4"

const Mutation = {
    createUser: (parent, args, { db, pubsub }, info) => {            
        const emailTaken = db.blogUsers.some((currentUser) => {
            return currentUser.email === args.data.email
        })
        if(emailTaken)
            throw new Error('The email is already taken')
        
        const newUser = {
            id: uuid(),
            ...args.data
        }
        db.blogUsers.push(newUser)
        return newUser
    },
    deleteUser(parent, args, { db, pubsub }, info) {
        const userIndex = db.blogUsers.findIndex((currentUser) => currentUser.id === args.id)
        if(userIndex === -1)
            throw new Error("No such user")
        const [deletedUser] = db.blogUsers.splice(userIndex,1)

        db.posts = db.posts.filter((currentPost) => {
            const match = currentPost.author === args.id

            if(match) {
                db.comments = db.comments.filter((comment) => comment.post !== currentPost.id)
            }

            return !match
        })
        db.comments = db.comments.filter((comment) => comment.author !== args.id)
        return deletedUser
    },
    updateUser(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const user = db.blogUsers.find((user) => user.id === id)

        if (!user) {
            throw new Error('User not found')
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.blogUsers.some((user) => user.email === data.email)

            if (emailTaken) {
                throw new Error('Email taken')
            }

            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user
    },
    createPost(parent, args, {db, pubsub}, info) {
        const authorId = args.data.author
        const userExists = db.blogUsers.some((currentUser) => currentUser.id === authorId)
        if(!userExists)
            throw new Error('No such author')
        const newPost = {
            id: uuid(),
            ...args.data
        }

        db.posts.push(newPost)
        console.log("NEW POST IS ---")
        console.log(newPost)
        if(newPost.published)
            pubsub.publish(`post-channel`, {
                post:{
                    mutation: 'CREATED',
                    data: newPost
                }
            })
        return newPost
    },
    deletePost(parent, args, {db, pubsub}, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)
        if(postIndex === -1)
            throw new Error("No such post")
        const [deletedPost] = db.posts.splice(postIndex,1)
        db.comments = db.comments.filter((comment) => comment.post !== args.id)

        if (deletedPost.published) {
            pubsub.publish(`post-channel`, {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            })
        }
        return deletedPost
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)
        const originalPost = { ...post }

        if (!post) {
            throw new Error('Post not found')
        }

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (originalPost.published && !post.published) {
                pubsub.publish(`post-channel`, {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish(`post-channel`, {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish(`post-channel`, {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, {db, pubsub}, info) {
        const authorExists = db.blogUsers.some((currentUser) => currentUser.id === args.data.author)
        if(!authorExists)
            throw new Error('No such author')

        const postExists = db.posts.some((currentPost) => {
            return currentPost.id === args.data.post && currentPost.published
        })
        if(!postExists)
            throw new Error('No such post')
        
        const newComment = {
            id: uuid(),
            ...args.data
        }

        db.comments.push(newComment)
        pubsub.publish(`comment-channel-${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
        return newComment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
        if(commentIndex === -1)
            throw new Error("No such comment")
        const [deletedComment] = db.comments.splice(commentIndex,1)
        pubsub.publish(`comment-channel-${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })
        return deletedComment
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('Comment not found')
        }

        if (typeof data.text === 'string') {
            comment.text = data.text
        }

        pubsub.publish(`comment-channel-${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export default Mutation