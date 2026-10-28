import type { ReactNode } from 'react';
import styles from './PageShell.module.css';
export function PageShell({ children }: { children: ReactNode }) {
  return <main id="main-content" tabIndex={-1} className={styles.container + ' pageWidth'}>{children}</main>;
}
