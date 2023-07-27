const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { events, users, participants, locations } = require("./data");
const { v4: uuidv4 } = require("uuid");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Event

  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: String!
    user_id: ID!
    user: User!
    participants: [Participant!]
    location: [Location!]
  }

  input CreateEventInput {
    title: String
    desc: String
    location_id: ID
    user_id: ID
  }

  input UpdateEventInput {
    title: String
    location_id: ID
    user_id: ID
    desc: String
  }

  input UpdateEventInput {
    title: String
    user_id: ID
  }

  # Location #

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }

  input CreateLocationInput {
    id: ID
    name: String
  }

  input UpdateLocationInput {
    name: String
    desc: String
  }

  type DeleteAllOutput {
    count: Int!
  }

  # Participant #
  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  input CreateParticipantInput {
    user_id: ID
    event_id: ID
  }

  input UpdateParticipantInput {
    user_id: ID
    event_id: ID
  }

  type DeleteAllOutput {
    count: Int!
  }

  # User #

  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]
  }

  input UpdateUserInput {
    username: String
    email: String
  }

  input CreateUserInput {
    username: String
    email: String
  }

  type DeleteAllOutput {
    count: Int!
  }

  type Mutation {
    #USER
    createUser(data: CreateUserInput): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUser: DeleteAllOutput!

    #EVENT
    createEvent(data: CreateEventInput): Event!
    updateEvent(id: ID!, data: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Event!
    deleteAllEvents: DeleteAllOutput!

    #LOCATİON
    createLocation(data: CreateLocationInput): Location!
    updateLocation(id: ID!, data: UpdateLocationInput!): Location!
    deleteLocation(id: ID!): Location!
    deleteAllLocations: DeleteAllOutput!

    # PARTİCİPANT #
    createParticipant(data: CreateParticipantInput): Participant!
    updateParticipant(id: ID!, data: UpdateParticipantInput!): Participant!
    deleteParticipant(id: ID!): Participant!
    deleteAllParticipants: DeleteAllOutput!
  }

  type Query {
    events: [Event!]
    event(id: ID!): Event!

    users: [User!]!
    user(id: ID!): User!

    locations: [Location!]!
    location(id: ID!): Location!

    participants: [Participant!]!
    participant(id: ID!): Participant
  }
`;

const resolvers = {
  Query: {
    events: () => events,
    event: (parent, args) => events.find((evt) => evt.id === parseInt(args.id)),

    users: () => users,
    user: (parent, args) => users.find((user) => user.id === parseInt(args.id)),

    participants: () => participants,
    participant: (parent, args) =>
      participants.find((participant) => participant.id === parseInt(args.id)),

    locations: () => locations,
    location: (parent, args) =>
      locations.find((location) => location.id === parseInt(args.id)),
  },
  Event: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    participants: (parent) =>
      participants.filter(
        (partipant) => partipant.event_id === parseInt(parent.id)
      ),
    location: (parent) =>
      locations.find((location) => location.id === parent.location_id),
  },
  User: {
    events: (parent, args) => events.filter((event) => event.id === parent.id),
  },
  Mutation: {
    // USER //
    createUser: (parent, { data }) => {
      const user = {
        id: uuidv4(),
        ...data,
      };

      users.push(user);

      return user;
    },
    updateUser: (parent, { id, data }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("User Not Found");
      }

      const update_User = (users[user_index] = {
        ...users[user_index],
        ...data,
      });

      return update_User;
    },
    deleteUser: (parent, { id }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("user not found");
      }
      const deleted_user = users[user_index];
      users.splice(user_index, 1);
      return deleted_user;
    },
    deleteAllUser: () => {
      const length = users.length;
      users.splice(0, length);
      return {
        count: length,
      };
    }, // EVENT //
    createEvent: (parent, { data }) => {
      const event = {
        id: uuidv4(),
        ...data,
      };
      events.push(event);
      return event;
    },
    updateEvent: (parent, { id, data }) => {
      const event_index = events.findIndex((event) => event.id === id);
      if (event_index === -1) {
        throw new Error("Event Not Found");
      }
      const updateEvent = (events[event_id] = {
        ...events[event_index],
        ...data,
      });

      return updateEvent;
    },
    deleteEvent: (parent, { id }) => {
      const event_index = users.findIndex((event) => event.id === id);
      if (event_index === -1) {
        throw new Error("Not Found User");
      }
      const delete_event = events[event_index];
      users.splice(event_index, 1);

      return delete_event;
    },
    deleteAllEvents: () => {
      const length = events.length;
      events.splice(0, length);
      return {
        count: length,
      };
    }, // PARTİCİPANT
    createParticipant: (parent, { data }) => {
      const participant = { ...data };

      participants.push(participant);

      return participant;
    },
    updateParticipant: (parent, { id, data }) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id === id
      );
      if (participant_index === -1) {
        throw new Error("participant not found");
      }
      const updated_participant = (participants[participant_index] = {
        ...participants[participant_index],
        ...data,
      });
      return updated_participant;
    },
    deleteParticipant: (parent, { id }) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id === id
      );
      if (participant_index === -1) {
        throw new Error("participnat not found");
      }
      const deleted_participant = participants[participant_index];
      participants.splice(participant_index, 1);
      return deleted_participant;
    },
    deleteAllParticipants: () => {
      const length = participants.length;
      participants.splice(0, length);
      return {
        count: length,}
    }, // LOCATİON
    updateLocation: (parent, { id, data }) => {
      const location_index = locations.findIndex(
        (location) => location.id === id
      );
      if (location_index === -1) {
        throw new Error("Location not found");
      }
      const updated_location = (locations[location_index] = {
        ...locations[location_index],
        ...data,
      });
      return updated_location;
    },
    deleteLocation: (parent, { id }) => {
      const location_index = locations.findIndex(
        (location) => location.id === id
      );
      if (location_index === -1) {
        throw new Error("location not found");
      }
      const deleted_location = locations[location_index];
      locations.splice(location_index, 1);
      return deleted_location;
    },
    deleteAllLocations: () => {
      const length = locations.length;
      locations.splice(0, length);
      return {
        count: length,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

server.listen(4001).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
