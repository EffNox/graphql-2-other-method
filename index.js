const express = require('express');
const schema = require('./src/schema/schema');
const { parsed: { PORT, GQL, DB } } = require('dotenv').config()
const { connect, pluralize } = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const expressPlayGround = require('graphql-playground-middleware-express').default
const { valJwt } = require('./src/middlewares/jwt')

const init = async () => {
    const app = express();

    pluralize(null)
    await connect(DB, { useNewUrlParser: !0, useUnifiedTopology: !0, useFindAndModify: !1 })

    // const context = async ({ req, connection }) => {
    //     return { auth: req.auth }
    // }
    const context = async ({ req, connection }) => ({ ...req.auth })
    const server = new ApolloServer({ schema, introspection: !0, playground: !0, context })
    app.use(valJwt)
    server.applyMiddleware({ app, cors: !0 })
    app.get('/graphql', expressPlayGround())

    app.listen(PORT, () => console.log(GQL));
}

init()
