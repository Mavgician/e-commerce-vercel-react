## Welcome

This is a project made for Platform Technologies. This is a mock website that features a transactional-based system for a ticket selling business. The goal of this project is to probide users and customers valuable insight on how a system such as this works inside and out. This project will feature a full front-end experience powered by Firebase.

## Requirements

This project assumes that the developer knows how to write JavaScript, CSS, HTML, Bootstrap and knows how to use the React framework effectively.

```bash
NodeJS >= 10.5.0
Firebase CLI
```

## Getting Started

Install all the required packages first using:
```bash
npm install
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Additional Setup

With Firebase installed, developers will need to get the API keys from the Firebase console.

1. Make a new file inside the `src\app\scripts` folder and name it `firebase.js`
2. Copy the code below into the newly created file.

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {...};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app)
```

3. Go to the [Firebase Console](https://console.firebase.google.com/u/1/project/silkroad-apparel/)
4. Find the gear icon on the top left.
5. Go to project settings and then scroll down.
6. You should see SDK Setup and configuration, set it to npm.
7. Copy the contents inside `const firebaseConfig` and paste it inside your Firebase config. 

After adding these lines to the firebase.js file, you are all set.

## Project Deployment

Once the project has been finished and the bugs have been squashed. The team will deploy the project on Vercel. A web hosting service tailor made for the needs of Next.js.
