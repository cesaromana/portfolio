import { lazy, Suspense } from 'react';
import LangProvider from './i18n/LangProvider';
import Site from './Site';

const PhoneController = lazy(() => import('./control/PhoneController'));

export default function App() {
  const isController = window.location.pathname.replace(/\/+$/, '') === '/control';
  if (isController) {
    return (
      <LangProvider>
        <Suspense fallback={null}>
          <PhoneController />
        </Suspense>
      </LangProvider>
    );
  }
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  );
}
