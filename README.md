# E-Split: Social Expense Sharing Platform

E-Split is a modern, real-time web application designed to eliminate the friction of shared expenses. Whether you are traveling with friends, splitting rent with roommates, or managing team funds, E-Split provides an automated, mathematically optimized financial engine to track costs and settle debts.

## Project Overview

Managing shared costs manually is tedious and often leads to complex webs of "who owes whom". E-Split solves this by acting as a central ledger. Users can form groups, log expenses paid by individuals, and let the system calculate exactly how much each person owes. 

Beyond simple tracking, E-Split implements an **Advanced Debt Simplification Algorithm** that recalculates the entire group's debts to find the absolute minimum number of transactions required to settle everyone up.

---

## Core Features & Functionality

### 1. Advanced Debt Simplification Engine
At the heart of E-Split is a settlement algorithm that minimizes financial transactions. 
- **How it works:** Instead of person A paying person B, and person B paying person C, the system calculates the "net balance" of every user in a group. It then pairs the biggest debtors with the biggest creditors, ensuring that all debts are cleared in the fewest number of transfers possible.

### 2. Real-Time Group Ledgers
- Create customized groups for different events (e.g., "Pokhara Trip").
- Members can instantly add expenses, specifying the total amount and what it was for.
- Because the application is connected to a Firebase Realtime Database, when one user adds an expense, it instantly updates the balances on the screens of all other group members without requiring a page refresh.

### 3. Connections & Social Graph
- Users are assigned unique, auto-generated `@usernames` upon signup.
- A robust connection system allows users to search, send friend requests, and accept/decline connections. 
- You can only form financial groups or send digital gifts to users who are officially on your connections list, adding a layer of privacy and security.

### 4. Digital Wallets & Direct Payments
- **Internal Wallet:** Every user starts with an internal digital wallet. Debts can be "settled" directly by transferring funds from one wallet to another within the app.
- **External Record Keeping:** If users settle up in the real world (via Cash, Bank Transfer, or external QR codes), they can use the "Record Payment" feature to log the transaction. 

### 5. Interactive Dashboard
- A central chronological activity feed aggregates every expense, payment, and settlement across all groups.
- Visual status cards show users exactly how much they owe in total, how much is owed to them, and their current wallet balance.

---

## Application Architecture

E-Split is built on a modern **Serverless Client-Server Architecture** using **Next.js (App Router)**.

1. **Frontend (Client Components):** Built using React, managing local UI state, modals, and user inputs. It utilizes a highly modular design with separate components for navigation, authentication, and core business logic.
2. **Backend (API Routes):** Server-side endpoints located in `app/api/`. These act as secure intermediaries. Instead of the client writing directly to the database, the client calls these APIs, which validate the data (checking for sufficient balances, verifying group memberships) before using `firebase-admin` to mutate the database.
3. **Database (Firebase Realtime DB):** Acts as the single source of truth. The application utilizes persistent WebSocket connections to listen for database changes, pushing new data to the UI instantly.

---

## Comprehensive Code Structure

The project directory is structured to separate presentation, business logic, and backend security.

### 1. Core Logic (`app/lib/`)
The brain of the application.
- `calculations.js`: The most critical file in the system. It contains the mathematical models for computing raw balances, individual debts (`getMyDebts`), individual credits (`getMyCredits`), and the `computeSettlementPlan` function which drives the debt simplification algorithm.
- `api.js`: A utility wrapper for frontend components to communicate with the backend API routes cleanly.
- `firebase.js` & `firebaseAdmin.js`: Configuration for Firebase.

### 2. Frontend User Interface (`app/components/`)
Modular React components that build the visual experience.
- `AppShell.js`: The central nervous system of the UI. It establishes all real-time Firebase listeners (`onValue`) for groups and connections, holding the global state and passing it down to child components.
- `ESplit.js`: The main financial interface. Handles the UI for creating groups, viewing optimal settlement plans, and displaying the history of expenses/payments.
- `Dashboard.js`: Aggregates data from `AppShell` to display total net worth, pending contributions, and a chronological activity feed.
- `Connections.js`: Manages the social graph, handling the UI for incoming/outgoing friend requests.
- `BottomNav.js` & `Topnav.js`: Responsive navigation structures. `BottomNav.js` includes a simulated interactive QR scanner for logging external payments.
- `AuthPage.js`: Handles Google OAuth and Email/Password registration, automatically generating user profiles.

### 3. Backend API Routes (`app/api/`)
Secures database operations and prevents unauthorized access.
- `api/groups/route.js`: Handles creating new groups and verifying the creator is added as a member.
- `api/groups/[groupId]/expenses/route.js`: Validates expense additions, ensuring the amount is valid and automatically deducting funds from the payer's digital wallet.
- `api/groups/[groupId]/payments/route.js`: Handles settlement transactions, verifying that the payer has sufficient wallet balance before transferring funds to the creditor.
- `api/connections/route.js`: Manages the state machine of friend requests (Pending -> Accepted/Declined).

---

## Security & Data Integrity

- **Validation:** All financial transactions (expenses, settlements, gifts) are validated server-side. The system checks wallet balances before allowing transfers.
- **Authorization checks:** Users can only view or interact with groups they are officially a member of. Attempting to fetch a group summary for an unauthorized group is blocked at the API level.
- **Data Sanitation:** API routes strip sensitive information (like passwords or internal database IDs) before returning user profiles to the client.