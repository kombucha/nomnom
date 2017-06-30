import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { CSSTransitionGroup } from "react-transition-group";

import { Card, CardTitle } from "../Card";

const TRANSITION_TIME = 450; // how to get this from theme ? (apart from importing it...)
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

  &.animate-enter {
    opacity: 0.01;
  }

  &.animate-enter.animate-enter-active {
    opacity: 1;
    transition: opacity ${props => props.theme.transitionConfig};
  }
`;

const DialogCard = styled(Card)`
  width: 75%;
  max-width: 768px;

  .animate-enter & {
    transform: translateY(-200px);
  }

  .animate-enter.animate-enter-active & {
    transform: translateY(0);
    transition: transform ${props => props.theme.transitionConfig};
  }
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

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
    const dialogTitle = title
      ? <CardTitle>
          {title}
        </CardTitle>
      : null;
    const dialogActions =
      actions && React.Children.count(actions) > 0
        ? <DialogActions>
            {React.Children.toArray(actions)}
          </DialogActions>
        : null;

    return (
      <CSSTransitionGroup
        transitionName="animate"
        transitionEnterTimeout={TRANSITION_TIME}
        transitionLeave={false}
        component="div">
        {open
          ? <DialogContainer
              onClick={this._handleDismiss}
              innerRef={ref => (this._dialogContainer = ref)}>
              <DialogCard>
                {dialogTitle}
                {children}
                {dialogActions}
              </DialogCard>
            </DialogContainer>
          : null}
      </CSSTransitionGroup>
    );
  }
}

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.node),
  onRequestClose: PropTypes.func
};

Dialog.defaultProps = {
  open: true,
  onRequestClose: () => {}
};

export default Dialog;
