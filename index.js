const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`Server started at: ${url}`);
});