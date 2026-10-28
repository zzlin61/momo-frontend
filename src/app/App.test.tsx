import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';

afterEach(cleanup);

describe('application scaffold', () => {
  it('renders the home route', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Momo 前端原型' })).toBeTruthy();
  });

  it('reads a decoded keyword from a direct search URL', () => {
    render(
      <MemoryRouter initialEntries={['/search/%E9%9E%8B%E5%AD%90']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: '搜尋：鞋子' })).toBeTruthy();
  });
});
