# E-Split

A modern web application built with Next.js for social expense sharing. E-Split helps groups of friends, roommates, and travelers track shared expenses, compute the minimum number of transactions needed to settle debts, and manage payments effortlessly.

## What is this project?

E-Split was designed to solve the common problem of tracking shared costs and figuring out exactly who owes whom after a trip or shared event. Instead of manually calculating individual debts, E-Split provides an automated financial engine that balances the books.

It features a simulated internal wallet system, allowing users to "record" direct payments via external means (like bank transfers or eSewa) or settle debts directly through their E-Split digital balance. The entire platform is real-time, meaning changes reflect instantly across all connected devices.

## Core Features

- **Group Expense Tracking:** Create dedicated spaces (e.g., "Pokhara Trip", "Apartment Rent") and log shared costs.
- **Advanced Debt Splitting:** Automatically calculates "who owes whom" and minimizes total transactions needed to settle up using an optimized debt simplification algorithm.
- **Connections & Friends:** Find and add friends using a unique, auto-generated `@username` system.
- **Digital Wallets & Payments:** Simulated internal wallet system to handle settlements seamlessly. 
- **Real-time Synchronization:** Built on Firebase Realtime Database for instant updates across devices without needing to refresh.
- **Activity Feed & Dashboard:** A comprehensive dashboard detailing recent activities, pending connection requests, and collection summaries.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database & Authentication:** Firebase Realtime Database and Firebase Auth
- **Styling:** CSS Modules / Vanilla Global CSS Variables
- **Architecture:** Client-side React components interacting with server-side API routes.

## Code Structure

The application follows a clean separation of concerns, structured primarily into three directories:

- **`app/api/` (Server API)**
  Contains the backend logic. Routes handle secure interactions with Firebase Admin, ensuring that transactions (like adding expenses or settling debts) are validated on the server before mutating the database.
  
- **`app/components/` (Frontend UI)**
  Contains all modular React components.
  - `AppShell.js`: The core layout wrapper that manages global real-time Firebase listeners and synchronizes state (Groups, Connections, Requests) across all child views.
  - `ESplit.js`: The main interface for managing groups, recording expenses, and viewing the optimal settlement plan.
  - `Dashboard.js`: Aggregates the user's financial overview and chronological activity feed.

- **`app/lib/` (Core Logic & Utilities)**
  - `calculations.js`: The central financial engine. It houses the algorithms that calculate net balances, individual debts, and the optimal transaction plan to minimize the number of required settlements.
  - `firebase.js` & `firebaseAdmin.js`: Client and Server Firebase configuration modules.