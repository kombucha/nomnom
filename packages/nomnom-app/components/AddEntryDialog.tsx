import React, { useState, useEffect } from "react";

import Dialog from "../toolkit/Dialog";
import FlatButton from "../toolkit/FlatButton";
import TextField from "../toolkit/TextField";
import useAddUserEntryMutation from "../graphql/mutations/addUserEntry";

type AddEntryDialogProps = {
  open: boolean;
  onRequestClose: Function;
};

const AddEntryDialog = ({ open = false, onRequestClose }: AddEntryDialogProps) => {
  const [url, setUrl] = useState("");
  const addUserEntry = useAddUserEntryMutation();

  const handleAddEntry = () => {
    onRequestClose(true);
    addUserEntry(url);
  };

  useEffect(() => {
    if (!open) setUrl("");
  }, [open]);

  const actions = (
    <>
      <FlatButton secondary onClick={onRequestClose}>
        Cancel
      </FlatButton>
      ,
      <FlatButton primary disabled={!url} onClick={handleAddEntry}>
        Add
      </FlatButton>
    </>
  );

  return (
    <Dialog title="Add entry" open={open} actions={actions} onRequestClose={onRequestClose}>
      <TextField
        hintText="Enter url"
        value={url}
        onChange={evt => setUrl(evt.target.value)}
        autoFocus
      />
    </Dialog>
  );
};

export default AddEntryDialog;
