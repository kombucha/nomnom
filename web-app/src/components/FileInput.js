import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const DropZone = styled.div`
  position: relative;
  border-radius: 2px;
  border: 2px dashed lightgrey;
  padding: 8px;
  background-color: ${props => (props.draggingOver ? "rgba(0, 0, 0, 0.05)" : "inherit")};
`;

const InputFile = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
`;

export class FileInput extends Component {
  constructor() {
    super();
    this.state = { draggingOver: false };
    this._handleDragEnter = this._handleDragEnter.bind(this);
    this._handleDragOver = this._handleDragOver.bind(this);
    this._handleDragLeave = this._handleDragLeave.bind(this);
    this._handleFileDrop = this._handleFileDrop.bind(this);
    this._handleFileSelect = this._handleFileSelect.bind(this);
  }

  _canDrop(ev) {
    return this.props.multiple || ev.dataTransfer.items.length === 1;
  }

  _handleDragOver(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    ev.dataTransfer.dropEffect = this._canDrop(ev) ? "copy" : "none";
  }

  _handleDragEnter(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ draggingOver: this._canDrop(ev) });
  }

  _handleDragLeave(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ draggingOver: false });
  }

  _handleFileDrop(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const value = Array.from(ev.dataTransfer.files);
    this.props.onChange(value);
  }

  _handleFileSelect(ev) {
    const value = Array.from(ev.target.files);
    this.props.onChange(value);
  }

  _renderValue(value) {
    return (
      <ul>
        {value.map(file => <li key={name}>{file.name}</li>)}
      </ul>
    );
  }

  render() {
    const { value, multiple } = this.props;
    const { draggingOver } = this.state;

    return (
      <DropZone draggingOver={draggingOver}>
        <span>Select file from computer by clicking or dropping it here</span>
        {value && value.length > 0 && this._renderValue(value)}
        <InputFile
          type="file"
          onChange={this._handleFileSelect}
          multiple={multiple}
          onDrop={this._handleFileDrop}
          onDragEnter={this._handleDragEnter}
          onDragOver={this._handleDragOver}
          onDragLeave={this._handleDragLeave}
        />
      </DropZone>
    );
  }
}

FileInput.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  multiple: PropTypes.bool
};
FileInput.defaultProps = {
  value: [],
  onChange: value => {},
  multiple: false
};

export default FileInput;
