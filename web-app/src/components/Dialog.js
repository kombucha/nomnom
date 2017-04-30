import React, { Component } from "react";
import styled from "styled-components";

import { Card, CardTitle } from "./Card";

const DialogContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 10001;

  background-color: rgba(0, 0, 0, 0.54);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const DialogCard = styled(Card)`
 width: 75%;
 max-width: 768px;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

// TODO: animations
export class Dialog extends Component {
  constructor() {
    super();
    this._handleDismiss = this._handleDismiss.bind(this);
  }

  _handleDismiss(ev) {
    const clickedOutsideDialog = ev.target === this._dialogContainer;
    if (clickedOutsideDialog) {
      this.props.onRequestClose();
    }
  }

  render() {
    const { open, title, actions, children } = this.props;

    if (!open) {
      return null;
    }

    const dialogTitle = title ? <CardTitle>{title}</CardTitle> : null;
    const dialogActions = actions && React.Children.count(actions) > 0
      ? <DialogActions>{React.Children.toArray(actions)}</DialogActions>
      : null;

    return (
      <DialogContainer
        onClick={this._handleDismiss}
        innerRef={ref => (this._dialogContainer = ref)}>
        <DialogCard>
          {dialogTitle}
          {children}
          {dialogActions}
        </DialogCard>
      </DialogContainer>
    );
  }
}

export default Dialog;
