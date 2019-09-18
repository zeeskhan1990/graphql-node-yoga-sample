const Subscription = {
    /* count: {
        subscribe(parent, args, {pubsub}, info) {
            ctx.pubsub.publish('trigger-channel', {
                count:189
            })
            
            ctx.pubsub.publish('trigger-channel-two', {
                count:255
            })
            return pubsub.asyncIterator(['trigger-channel', 'trigger-channel-two'])
        }
    }, */
    comment: {
        subscribe(parent, {postId}, {db, pubsub}, info) {
            //This is to just check for existence before subscribing
            const post = db.posts.find((post) => post.id === postId && post.published)
            if(!post)
                throw new Error("No post")
            
            return pubsub.asyncIterator(`comment-channel-${postId}`)
        }
    },
    post: {
        subscribe(parent, {postId}, {db, pubsub}, info) {            
            return pubsub.asyncIterator(`post-channel`)
        }
    }
}

export default Subscription