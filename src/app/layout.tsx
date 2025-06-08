import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Theme appearance="light" accentColor="iris">
          {children}
        </Theme>
      </body>
    </html>
  );
}
