import { gql } from "@apollo/client";

export type Device = {
  id: string;
  name: string;
  macAddress: string;
  description: string | null;
};

export const LIST_DEVICES = gql`
  query ListDevices {
    devices {
      id
      name
      macAddress
      description
    }
  }
`;

export const GET_DEVICE = gql`
  query GetDevice($id: ID!) {
    device(id: $id) {
      id
      name
      macAddress
      description
    }
  }
`;

export const CREATE_DEVICE = gql`
  mutation CreateDevice(
    $name: String!
    $macAddress: String!
    $description: String
  ) {
    createDevice(
      name: $name
      macAddress: $macAddress
      description: $description
    ) {
      id
      name
      macAddress
      description
    }
  }
`;

export const UPDATE_DEVICE = gql`
  mutation UpdateDevice(
    $id: ID!
    $name: String!
    $macAddress: String!
    $description: String
  ) {
    updateDevice(
      id: $id
      name: $name
      macAddress: $macAddress
      description: $description
    ) {
      id
      name
      macAddress
      description
    }
  }
`;

export const DELETE_DEVICE = gql`
  mutation DeleteDevice($id: ID!) {
    deleteDevice(id: $id) {
      id
      name
      macAddress
      description
    }
  }
`;
