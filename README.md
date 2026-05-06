# E-Split

E-Split is a web application built for students and roommates to easily share expenses and manage money. When you travel in a group or live together, it is very hard to calculate exactly who owes who. E-Split solves this problem by doing all the math automatically and telling you exactly how to settle debts.

## How It Works (Step-by-Step Workflow)

This is the full process of how the application works from start to finish:

1. **Sign Up & Profile Creation:** 
   When a user signs up using their email or Google account, the app automatically generates a unique `@username` for them. They are given a starting digital wallet balance so they can test the application.

2. **Connecting with Friends:** 
   Before sharing expenses, users must connect with each other. A user searches for their friend's `@username` and sends a connection request. Once accepted, they become friends.

3. **Creating a Group (E-Split):** 
   If a group of friends goes on a trip, one person creates a new "E-Split" group (for example: "Pokhara Trip") and adds their connected friends to this group.

4. **Adding Expenses:** 
   During the trip, whenever someone pays for something (like a taxi or lunch), they log it in the group as an expense. The app takes that amount and automatically splits it equally among all members.

5. **Automatic Debt Calculation:** 
   As more expenses are added, the app keeps a running total. It uses a mathematical algorithm to simplify the debts. Instead of everyone paying each other in a messy way, the app finds the minimum number of transactions needed so everyone gets their money back.

6. **Final Settlement:** 
   At the end of the trip, users check the "Balances" tab. The app tells them exactly who they need to pay. Users click the "Pay Now" or "Settle All" button, and the money is securely transferred from their internal digital wallet to their friend's wallet. 

## Features

- **Group Management:** Make specific groups for specific events.
- **Internal Digital Wallet:** Simulated digital wallet to securely process the payments between friends.
- **QR Payment Scanner:** A simulated QR code scanner to log payments made outside the app (like paying a shop directly via eSewa or bank).
- **Real-Time Data:** If someone adds an expense on their phone, it instantly appears on your screen. You do not need to refresh the page.
- **Activity Feed:** See a full history of every single expense added and every payment made.

## Technologies Used

- **Frontend:** Next.js (React) for the user interface.
- **Backend:** Next.js API Routes for handling server logic securely.
- **Database:** Firebase Realtime Database for instant data syncing.
- **Authentication:** Firebase Authentication (Email/Password and Google Login).
- **Styling:** Custom CSS.

## Code Structure

- `app/api/`: Contains the secure server routes. When you add an expense or settle a debt, the frontend sends a request here. The server validates if you have enough money in your wallet before saving it to the database.
- `app/components/`: Contains all the visual parts of the app. For example, `ESplit.js` handles the group pages, and `Dashboard.js` handles the main screen.
- `app/lib/`: Contains `calculations.js`, which holds the core mathematical logic that simplifies the group debts.