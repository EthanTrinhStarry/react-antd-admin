import type { BrowserHistory, MemoryHistory } from 'history';

import { createBrowserHistory, createMemoryHistory } from 'history';
import React, { type PropsWithChildren } from 'react';
import { Router } from 'react-router-dom';

type RouterHistory = BrowserHistory | MemoryHistory;

export const history: RouterHistory = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();

interface HistoryRouterProps {
  history: RouterHistory;
  initialPath: string;
}

export const HistoryRouter: React.FC<PropsWithChildren<HistoryRouterProps>> = ({ history, initialPath, children }) => {
  const routerHistory = React.useMemo(
    () => (typeof window === 'undefined' ? createMemoryHistory({ initialEntries: [initialPath] }) : history),
    [history, initialPath],
  );
  const [state, setState] = React.useState({
    action: routerHistory.action,
    location: routerHistory.location,
  });

  React.useEffect(() => routerHistory.listen(setState), [routerHistory]);

  return React.createElement(Router, Object.assign({ children, navigator: routerHistory }, state));
};
