
# Full Stack MERN Web Application

Welcome to our Full Stack MERN Web Application! This project is built using the MERN stack along with Firebase for seamless Authentication and Authorization. Dive into a robust and dynamic application featuring real-time chat, post creation, comments, likes, and user interactions.

## Features

- **Tech Stack**: MERN (MongoDB, Express.js, React, Node.js) + Firebase
- **Authentication & Authorization**: Secure login with JWT
- **Real-Time Chat**: Stay connected with instant messaging
- **Post Creation**: Share your thoughts and ideas
- **Comments**: Engage with posts through comments
- **Likes**: Show appreciation by liking posts
- **Follow/Unfollow**: Connect with other users by following or unfollowing

## Getting Started

### Setup Environment Variables

Create a `.env` file in the `server` directory with the following content:

```plaintext
# Random password used as secret key
SECRET_KEY=<Your-Secret-Key>

# Port number for testing
PORT=

# Bcrypt Salt Value
SALT_VALUE=<Your-Salt-Value>

# Cloudinary credentials
CLOUDINARY_NAME=<Your-Cloudinary-Name>
CLOUDINARY_API_KEY=<Your-Cloudinary-API-Key>
CLOUDINARY_SECRET_KEY=<Your-Cloudinary-Secret-Key>
```

### Firebase Configuration

Create a `firebase-config.js` file in the `client` directory with the following content:

```javascript
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "<Your-API-Key>",
    authDomain: "<Your-Auth-Domain>",
    projectId: "<Your-Project-ID>",
    storageBucket: "<Your-Storage-Bucket>",
    messagingSenderId: "<Your-Messaging-Sender-ID>",
    appId: "<Your-App-ID>"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Running the Application

**Front-end:**

Navigate to the `client` directory and run:

```bash
npm run dev
```

**Back-end/Server:**

Navigate to the `server` directory and run:

```bash
node index.js
```

## Conclusion

Thank you for exploring our Full Stack MERN Web Application! We hope you find it feature-rich and easy to use. For any questions or contributions, please feel free to reach out.

Happy coding!

---
