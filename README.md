# **Social App – MERN Stack**

A **full-stack social networking platform** built using the MERN stack (**MongoDB, Express.js, React.js, Node.js**) that allows users to connect, share posts, and interact in real-time. The project implements **secure authentication**, **role-based authorization**, and a fully responsive UI.

---

## **🚀 Features**
- **User Authentication & Authorization*
  - Secure **JWT-based login & signup**.
  - Role-based access control for admin and regular users.
- **Post Management**
  - Create, edit, delete, and view posts.
  - Like and comment functionalities.
- **Personalized Feeds**
  - Display posts from followed users.
  - Sorted and filtered dynamically.
- **Responsive UI**
  - Fully responsive design for desktop and mobile devices.
- **Security**
  - Password hashing using bcrypt.
  - Protected routes with token validation.

---

## **🛠 Tech Stack**
**Frontend:**
- React.js
- Axios
- CSS / Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose

**Authentication:**
- JSON Web Tokens (JWT)
- bcrypt for password hashing
- Cookies for session persistence

---

## **📂 Folder Structure**
```
/client      -> React frontend
/server      -> Node.js backend with Express
/models      -> MongoDB schemas
/controllers -> API logic
/routes      -> Backend API routes
```

---

## **⚙️ Installation & Setup**
1. **Clone the repository**
```bash
git clone https://github.com/JitheshD06/social-app-mern-stack.git
cd social-app-mern-stack
```
2. **Install dependencies for both frontend & backend**
```bash
cd client
npm install
cd ../server
npm install
```
3. **Set up environment variables**
Create a `.env` file in the `server` folder and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
4. **Run the app**
```bash
# Run backend
cd server
npm start

# Run frontend
cd client
npm start
```

---

## **📸 Screenshots**

<img width="1901" height="910" alt="image" src="https://github.com/user-attachments/assets/88bc81e1-eb64-425f-8f78-f8738ea54c4e" />


---

## **📌 Roadmap**
- [ ] Real-time chat with Socket.io
- [ ] Image & video uploads
- [ ] Notifications system
- [ ] Advanced search and filtering

---

## **🤝 Contributing**
Pull requests are welcome. For significant changes, please open an issue first to discuss what you would like to change.

---

## **📜 License**
This project is licensed under the MIT License.

---

