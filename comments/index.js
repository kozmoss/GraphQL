const { ApolloServer, gql } = require('apollo-server');
const {
  ApolloServerPluginLandingPageGraphQLPlayground
} = require('apollo-server-core');
const {events,users,participants,locations} = require('./data.json')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Event {
    id:ID!
    title:String!
    desc:String!
    date:String!
    from:String!
    to:String!
    location_id:String!
    user_id:ID!
    user:User!
    participants:[Participant!]
    location:[Location!]
  }
  type Location {
    id:ID!
    name:String!
    desc:String!
    lat:Float!
    lng:Float!
  }
type Participant {
  id:ID!
  user_id:ID!
  event_id:ID!
}

type User {
  id:ID!
  username:String!
  email:String!
  events:[Event!]!
}

  type Query {
    events: [Event!]
    event(id:ID!):Event!

    users:[User!]!
    user(id:ID!):User!

    locations:[Location!]!
    location(id:ID!):Location!


    participants:[Participant!]!
    participant(id:ID!):Participant
  }
`;

const resolvers = {
  Query: {
    events: () => events,
    event:(parent,args) => events.find((evt) => evt.id === parseInt(args.id) ),

    users: () => users,
    user: (parent,args) => users.find((user) => user.id === parseInt(args.id)),

    participants: () => participants,
    participant:(parent,args) => participant.find((participant) => participant.id === parseInt(args.id)),

    locations: () => locations,
    location: (parent,args) => locations.find((location) => location.id === parseInt(args.id)),
  },
  Event:{
    user:(parent) => users.find((user) => user.id === parent.user_id),
    participants:(parent) => participants.filter((partipant) => partipant.event_id === parseInt(parent.id)),
    location:(parent) => locations.find((location) => location.id === parent.location_id)
  },
  User:{
    events:(parent,args) => events.filter((event) => event.id === parent.id)
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({}),
  ],
});

server.listen(4001).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});