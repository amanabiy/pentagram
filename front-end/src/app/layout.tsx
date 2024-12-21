'use client';

import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from 'react-redux';
import store from './store/store'; // Adjust the path as needed
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
