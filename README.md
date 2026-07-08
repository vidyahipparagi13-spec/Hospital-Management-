# 🏥 Hospital Management System

A full-stack **Hospital Management System** built using **React**, **Node.js**, **Express**, and **SQLite**. This application helps manage hospital operations such as patient records, doctor information, appointments, and billing through a simple and responsive interface.

---

## 📌 Features

* 👨‍⚕️ Doctor Management
* 🧑‍🤝‍🧑 Patient Management
* 📅 Appointment Scheduling
* 💊 Medical Records
* 💰 Billing Management
* 🔍 Search and Filter Records
* 📱 Responsive User Interface
* ⚡ REST API Integration
* 💾 SQLite Database

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* CSS3

### Backend

* Node.js
* Express.js
* better-sqlite3

### Database

* SQLite

---

## 📂 Project Structure

```
hospital-management-system/
│
├── backend/
│   ├── index.js
│   ├── data.db
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/hospital-management-system.git
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on:

```
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 📡 API Endpoints

### Patients

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| GET    | `/patients`     | Get all patients  |
| GET    | `/patients/:id` | Get patient by ID |
| POST   | `/patients`     | Add new patient   |
| PUT    | `/patients/:id` | Update patient    |
| DELETE | `/patients/:id` | Delete patient    |

---

### Doctors

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | `/doctors`     | Get all doctors |
| POST   | `/doctors`     | Add doctor      |
| PUT    | `/doctors/:id` | Update doctor   |
| DELETE | `/doctors/:id` | Delete doctor   |

---

### Appointments

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/appointments`     | Get all appointments |
| POST   | `/appointments`     | Create appointment   |
| PUT    | `/appointments/:id` | Update appointment   |
| DELETE | `/appointments/:id` | Delete appointment   |

---

## 💻 Screenshots

Add screenshots of your application here.

Example:

```
screenshots/
├── dashboard.png
├── patients.png
├── doctors.png
└── appointments.png
```

---

## 🎯 Future Improvements

* User Authentication
* Role-Based Access Control
* Email Notifications
* Online Payment Integration
* PDF Report Generation
* Dashboard Analytics
* Cloud Database Support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Vidya Hipparagi**

Built with ❤️ using React, Node.js, Express, and SQLite.
