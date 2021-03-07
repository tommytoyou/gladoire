const gql = require('graphql-tag'); 


// this is a tag template string
module.exports = gql`
   type Post{
      id: ID!
      body: String!
      createdAt: String!
      username: String!
   }
   type User{
       id: String!
       email: String!
       token: String!
       username: String!
       createdAt: String!
   }
   input RegisterInput{
       username: String!
       password: String!
       confirmPassword: String!
       email: String!
   }
  type Query{
      getPosts: [Post]
  }
  type Mutation{
      register(registerInput: RegisterInput): User!
  }
`;