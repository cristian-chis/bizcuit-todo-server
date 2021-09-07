const { gql } = require('apollo-server');
const { v4: uuidv4 } = require('uuid');
let { projects } = require('./db');

const typeDefs = gql`
	type Project {
		id: ID!
		name: String!
		description: String!
		times: [Time!]
  	}

  	type Time {
		id: ID!
		description: String!
		amount: Int!
	}

	type Query {
		projects : [Project!]
		project (id: ID!) : Project
	}

	type Mutation {
		createProject (name: String!, description: String!) : Project!
		updateProject (id: ID!, name: String, description: String) : Project!
		deleteProject (id: ID!) : Boolean!
		addProjectTime (projectId: ID!, description: String!, amount: Int!) : Time!
		deleteProjectTime (projectId: ID!, id: ID!) : Boolean!
	}
`;

const resolvers = {
	Query: {
		projects: () => projects,
		project: (_, { id }) => projects.find((project) => project.id === id)
	},
	Mutation: {
		createProject: (root, { name, description }) => {
			const uuid = uuidv4();
			const project = {
				id: uuid,
				name,
				description
			};
			projects.push(project);
			return project;
		},
		updateProject: (root, { id, name, description }) => {
			const projectIdx = projects.findIndex((project) => project.id === id);
			if (projects[projectIdx]) {
				projects[projectIdx] = {...projects[projectIdx], name, description}
				return projects[projectIdx];
			} else {
				throw Error('Could not find project');
			}
		},
		deleteProject: (root, { id }) => {
			projects = projects.filter((project) => project.id !== id);
			return true;
		},
		addProjectTime: (root, { projectId, description, amount }) => {
			const uuid = uuidv4();
			const projectIdx = projects.findIndex((project) => project.id === projectId);
			if (projects[projectIdx]) {
				const time = { id: uuid, description, amount };
				if (!projects[projectIdx].times) {
					projects[projectIdx].times = [];
				}
				projects[projectIdx].times.push(time);
				return time;
			} else {
				throw Error('Could not find project');
			}
		},
		deleteProjectTime: (_, { projectId, id }) => {
			const projectIdx = projects.findIndex((project) => project.id === projectId);
			if (projects[projectIdx]) {
				projects[projectIdx].times = projects[projectIdx].times.filter((time) => time.id !== id);
				return true;
			} else {
				throw Error('Could not find project');
			}
		}
	}
}

module.exports = { typeDefs, resolvers };