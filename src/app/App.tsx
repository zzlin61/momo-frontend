import { Route, Routes } from 'react-router';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { PageShell } from '../shared/layout/PageShell';

export function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search/:keyword" element={<SearchPage />} />
      </Routes>
    </PageShell>
  );
}
