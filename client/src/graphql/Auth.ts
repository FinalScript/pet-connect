import { gql } from "../__generated__";


export const VERIFY_TOKEN = gql(`
  query VerifyToken {
    verifyToken {
      valid
    }
  }
`);
