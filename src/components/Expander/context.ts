import React from 'react';

interface ExpanderContextValue {
  handleClick: React.MouseEventHandler
}

const defaultContext: ExpanderContextValue = {
  handleClick() {}
}

export default React.createContext(defaultContext);
