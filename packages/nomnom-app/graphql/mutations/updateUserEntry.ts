import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { MutationUpdaterFn } from "apollo-client";

import updateStore from "./userEntryUpdateHelper";
import { updateUserEntryVariables, updateUserEntry, UserEntryStatus } from "../../apollo-types";

export const UPDATE_USER_ENTRY_MUTATION = gql`
  mutation updateUserEntry($entryUpdateInput: EntryUpdateInput!) {
    updateUserEntry(entryUpdateInput: $entryUpdateInput) {
      id
      progress
      status
      tags
      lastUpdateDate
    }
  }
`;

export const useEntryMutations = (id: string) => {
  const update: MutationUpdaterFn<updateUserEntry> = (proxy, result) =>
    updateStore(proxy, result.data.updateUserEntry);
  const [updateUserEntry] = useMutation<updateUserEntry, updateUserEntryVariables>(
    UPDATE_USER_ENTRY_MUTATION,
    { update }
  );

  return {
    archive: () =>
      updateUserEntry({
        variables: { entryUpdateInput: { id, status: UserEntryStatus.ARCHIVED } }
      }),
    favorite: () =>
      updateUserEntry({
        variables: { entryUpdateInput: { id, status: UserEntryStatus.FAVORITE } }
      }),
    updateProgress: (progress: number) =>
      updateUserEntry({
        variables: { entryUpdateInput: { id, progress } }
      })
  };
};

export default useEntryMutations;
