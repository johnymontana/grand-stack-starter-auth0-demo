
export const typeDefs = /* GraphQL */`
type User @isAuthenticated {
  id: ID!
  name: String
  friends: [User] @relation(name: "FRIENDS", direction: "BOTH")
  reviews: [Review] @relation(name: "WROTE", direction: "OUT")
  avgStars: Float @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN toFloat(avg(r.stars))")
  numReviews: Int @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN COUNT(r)")
}

type Business @hasRole(roles:[admin]){
  id: ID!
  name: String
  address: String
  city: String
  state: String
  reviews: [Review] @relation(name: "REVIEWS", direction: "IN")
  categories: [Category] @relation(name: "IN_CATEGORY", direction: "OUT")
}

type Review {
  id: ID!
  stars: Int
  text: String
  business: Business @relation(name: "REVIEWS", direction: "OUT")
  user: User @relation(name: "WROTE", direction: "IN")
}

type Category {
  name: ID!
  businesses: [Business] @relation(name: "IN_CATEGORY", direction: "IN")
}

type StarCount {
  star: Int
  count: Int
}

enum Role {
  reader
  user
  admin
}

type Query {
    starsByCategory(category: String): [StarCount] @hasRole(roles: [reader]) @cypher(statement: 
      """MATCH (c:Category)<-[:IN_CATEGORY]-(:Business)<-[:REVIEWS]-(r:Review)
         WHERE toLower(c.name) CONTAINS toLower($category)
         WITH toString(r.stars) AS stars, COUNT(*) AS num
         RETURN {star: stars, count: num}""")
}
`;
