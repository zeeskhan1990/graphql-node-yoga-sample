let blogUsers = [{
    id: '999',
    name: "prius",
    email:"prius@prius.com" 
},{
    id: '666',
    name: "hola",
    email:"hola@hola.com",
    age: 28 
},{
    id: '333',
    name: "phew",
    email:"phew@phew.com",
    age: 28 
}]

let posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '999'
}, {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '999'
}, {
    id: '12',
    title: 'Programming Music',
    body: 'Hello World',
    published: true,
    author: '666'
}]

let comments = [{
    id: '102',
    text: 'This worked well for me. Thanks!',
    author: '333',
    post: '10'
}, {
    id: '103',
    text: 'Glad you enjoyed it.',
    author: '666',
    post: '10'
}, {
    id: '104',
    text: 'This did no work.',
    author: '999',
    post: '11'
}, {
    id: '105',
    text: 'Nevermind. I got it to work.',
    author: '666',
    post: '12'
}]

const db = {blogUsers, posts, comments}

export {db as default}