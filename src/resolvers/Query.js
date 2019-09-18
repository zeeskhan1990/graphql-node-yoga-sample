const Query = {
    users(parent, args, ctx, info) {
        if(!args.query) {
            return ctx.db.blogUsers
        }

        return ctx.db.blogUsers.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, {db}, info) {
        if (!args.query) {
            return db.posts
        }

        return db.posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            return isTitleMatch || isBodyMatch
        })
    },
    comments(parent, args, {db}, info) {
        return db.comments 
    },
    me() {
        return {
            id: '999',
            name: "prius",
            email:"prius@prius.com" 
        }
    },
    post() {
        return {
            id: '100',
            title: 'Hello Post',
            body: "Body of hello post",
            published: true
        }
    }
}

export default Query