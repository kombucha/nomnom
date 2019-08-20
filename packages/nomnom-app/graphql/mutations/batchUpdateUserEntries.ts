import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { UserEntryListFragment } from "../fragments/userEntry";
import updateStore from "./userEntryUpdateHelper";
import {
  BatchUpdateUserEntriesMutation,
  BatchUpdateUserEntriesMutationVariables
} from "../../apollo-types";

export const BATCH_UPDATE_USER_ENTRIES = gql`
  mutation BatchUpdateUserEntriesMutation(
    $batchUpdateUserEntriesInput: BatchUpdateUserEntriesInput!
  ) {
    batchUpdateUserEntries(batchUpdateUserEntriesInput: $batchUpdateUserEntriesInput) {
      ...UserEntryListFragment
    }
  }
  ${UserEntryListFragment}
`;

export const useBatchUpdateUserEntries = () =>
  useMutation<BatchUpdateUserEntriesMutation, BatchUpdateUserEntriesMutationVariables>(
    BATCH_UPDATE_USER_ENTRIES,
    {
      update: (proxy, result) =>
        result.data.batchUpdateUserEntries.forEach(userEntry => {
          updateStore(proxy, userEntry);
        })
    }
  );

export default useBatchUpdateUserEntries;
