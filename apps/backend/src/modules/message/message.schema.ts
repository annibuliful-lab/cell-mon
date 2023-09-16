import gql from 'graphql-tag';

export const messageTypedefs = gql`
  type MessageGroup {
    id: ID!
    title: String!
    picture: String
    members: [MessageGroupMember!]
    messages: [MessageGroupData!]
  }

  type MessageGroupMember {
    accountId: ID!
    messageGroupId: ID!
    account: Account!
  }

  type MessageMedia {
    type: String!
    url: String!
  }

  type Message {
    text: String!
    media: [MessageMedia!]
  }

  type MessageGroupData {
    groupId: ID!
    authorId: ID!
    message: Message
  }

  input CreateMessageGroupInput {
    title: String!
    picture: String
  }

  input UpdateMessageGroupInput {
    title: String
    picture: String
  }

  input MessageGroupFilterInput {
    limit: Int
    offset: Int
    search: String
  }

  input CreateMessageGroupMemberInput {
    messageGroupId: ID!
    accountId: ID!
    role: String!
  }

  input DeleteMessageGroupMemberInput {
    messageGroupId: ID!
    accountId: ID!
  }

  input MessageGroupMemberFilterInput {
    accountId: ID
    messageGroupId: ID!
    search: String
    offset: Int
    limit: Int
  }

  input MessageMediaInput {
    type: String!
    url: String!
  }

  input MessageInput {
    text: String!
    media: [MessageMediaInput!]
  }

  input CreateMessageGroupDataInput {
    groupId: ID!
    message: MessageInput
  }

  input MessageGroupDataFilterInput {
    groupId: ID!
    search: String
    limit: Int
    offset: Int
  }

  type Mutation {
    createMessageGroup(input: CreateMessageGroupInput!): MessageGroup!
      @authorize

    updateMessageGroup(id: ID!, input: UpdateMessageGroupInput!): MessageGroup!
      @authorizeMessageGroup(canBeOwner: true)

    deleteMessageGroup(id: ID!): DeleteOperationResult!
      @authorizeMessageGroup(canBeOwner: true)

    createMessageGroupMember(
      input: CreateMessageGroupMemberInput!
    ): MessageGroupMember!
      @authorizeMessageGroup(canBeOwner: true, canBeAdmin: true)

    deleteMessageGroupMember(
      input: DeleteMessageGroupMemberInput!
    ): DeleteOperationResult!
      @authorizeMessageGroup(canBeOwner: true, canBeAdmin: true)

    createMessageData(input: CreateMessageGroupDataInput!): MessageGroupData!
      @authorizeMessageGroup

    deleteMessageDataById(id: ID!): DeleteOperationResult!
      @authorizeMessageGroup
  }

  type Query {
    findMessageGroupById(id: ID!): MessageGroup! @authorizeMessageGroup

    findMessageGroups(filter: MessageGroupFilterInput!): [MessageGroup!]!
      @authorize

    findMessageGroupData(
      filter: MessageGroupDataFilterInput!
    ): [MessageGroup!]! @authorizeMessageGroup

    findMessageGroupMemebers(
      filter: MessageGroupMemberFilterInput!
    ): [MessageGroupMember!]! @authorizeMessageGroup
  }
`;
