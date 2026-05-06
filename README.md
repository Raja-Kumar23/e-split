# E-Split

E-Split is a web application built for students and friends to easily manage shared expenses. The unique thing about this project is that it is built completely inside a fake digital wallet system. It handles the math of group expenses and also processes the simulated payments between friends live.

## How The Full Process Works

Here is the complete step-by-step process of how this project works from start to finish:

1. **Sign In & Fake Digital Wallet:** 
   When a user signs into the app for the first time, they are automatically given an initial balance of 20,000 in their fake digital wallet to test the app. 

2. **Unique Usernames & Connecting:** 
   After signing in, the system automatically creates a unique `@username` for the user. To start sharing expenses, users must search for their friends using these usernames and connect with them.

3. **Creating a Group:** 
   Users can create a specific group for an event, like a "Road Trip". Once the group is created, the user can add their connected friends into this group.

4. **Adding Expenses:** 
   During the trip, if a person pays for something (like hotel rent), they can add that expense to the group. The app automatically calculates how much each person in the group needs to pay for their share.

5. **Direct Payments:** 
   Instead of just adding expenses, users can also make direct payments through the dashboard if they pay for something on behalf of the group using an external method (like a real bank transfer or QR code).

6. **Live Dashboard & Calculations:** 
   Everything in this app is completely live. If someone adds an expense, it is automatically calculated and shown to everyone in the group instantly. Every person's dashboard will update live to show exactly who owes how much money. 

7. **Final Settlement:** 
   When the trip is over, users can look at their dashboard to see their final debts. Because they have the fake digital wallet with their initial 20,000 money, they can simply click a button to "settle up", and the fake money is instantly transferred from their wallet to their friend's wallet to clear the debt.

## Technologies Used

- **Frontend:** Next.js (React) for the user interface.
- **Backend:** Next.js API Routes for handling server logic.
- **Database:** Firebase Realtime Database for the instant live data syncing.
- **Authentication:** Firebase Authentication (Email/Password and Google Login).
- **Styling:** Custom CSS.

## Code Structure

- `app/api/`: Contains the server routes. When you add an expense or settle a debt, the server checks if you have enough money in your fake wallet before saving it to the database.
- `app/components/`: Contains all the visual parts of the app, like the Dashboard, the Group pages, and the Wallet UI.
- `app/lib/`: Contains `calculations.js`, which does all the heavy math to simplify the debts and figure out exactly who needs to pay who.