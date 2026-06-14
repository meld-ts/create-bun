import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './global.css';

// biome-ignore lint/style/noNonNullAssertion: app_root is declared in index.html and always present at runtime
const elem = document.getElementById('app_root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// biome-ignore lint/suspicious/noAssignInExpressions: ??= assignment is the idiomatic HMR pattern to persist root across hot reloads
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
