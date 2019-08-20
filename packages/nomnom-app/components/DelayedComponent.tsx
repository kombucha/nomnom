import React, { useState, useEffect } from "react";

type Props = { delay?: number };

const DelayedComponent: React.FC<Props> = ({ delay, children }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (delay === undefined) return;

    setShouldRender(false);
    const timeoutId = setTimeout(() => setShouldRender(true), delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);

  return shouldRender ? <>{children}</> : null;
};

export default DelayedComponent;
