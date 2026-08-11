import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSessionStore } from '../entities/session';
import { AddCategoryPage } from '../pages/add-category';
import { AddTransactionPage } from '../pages/add-transaction';
import { LoginPage } from '../pages/login';
import { TransactionsPage } from '../pages/transactions';
import { ToastContainer } from '../shared/ui';
import { AppQueryProvider } from './config/query-client';

function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export function App() {
  return (
    <AppQueryProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <TransactionsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/add"
            element={
              <RequireAuth>
                <AddTransactionPage />
              </RequireAuth>
            }
          />
          <Route
            path="/categories/new"
            element={
              <RequireAuth>
                <AddCategoryPage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AppQueryProvider>
  );
}
