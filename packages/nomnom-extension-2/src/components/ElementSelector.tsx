import { Component } from "preact";

import getElementUniqSelector from "../helpers/getElementUniqSelector";
import SelectorButton from "./SelectorButton";

interface Props {
  value: string;
  onChange: (value: string) => any;
}

class ElementSelector extends Component<Props> {
  render() {
    const { value, onChange } = this.props;
    return (
      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={evt => onChange((evt.target as HTMLInputElement).value)}
        />
        <SelectorButton
          onSelected={el => {
            const value = getElementUniqSelector(el);
            onChange(value);
          }}
        />
      </div>
    );
  }
}

export default ElementSelector;
