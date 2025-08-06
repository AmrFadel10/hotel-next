# 🏨 XHotel – Full Stack Hotel Reservation App

**Live Demo:** [xhotel.vercel.app](https://xhotel.vercel.app/)

A full-featured hotel reservation platform where users can search, book, and manage hotel rooms, while hotel owners can add and manage listings. Built with performance, UX, and scalability in mind.

---

## 🚀 Features

### 👥 Authentication & Authorization

- Secure login/signup with validation (Zod + bcrypt)
- Role-based access (Guests / Hotel Owners)

### 🏨 Hotel & Room Management

- Add, edit, and delete hotels & rooms
- Upload multiple images via Cloudinary

### 📅 Room Booking & Payments

- Real-time room availability
- Secure Stripe checkout integration

### 🧑‍💼 User Dashboard

- Guests: view and manage bookings
- Owners: manage hotels, rooms, and bookings

### 💡 Other Features

- Responsive design (Tailwind CSS)
- Instant notifications (react-hot-toast)
- Image optimization with Next.js

---

## 🛠️ Tech Stack

| Area            | Stack                                  |
| --------------- | -------------------------------------- |
| Frontend        | React (Next.js App Router), TypeScript |
| Styling         | Tailwind CSS, React Icons              |
| Backend         | Next.js API Routes, Prisma, Zod        |
| Auth & Security | JWT, bcryptjs, HttpOnly Cookies        |
| Database        | PostgreSQL (via Prisma ORM)            |
| Image Uploads   | Cloudinary                             |
| Payments        | Stripe API                             |

---

## 📁 Project Structure

```
.
├── app/               # Pages & API routes (Next.js)
├── components/        # Reusable UI components
├── prisma/            # Database schema & migrations
├── utils/             # Helpers (auth, validation, etc)
├── public/            # Static files
└── styles/            # Tailwind configs & global styles
```

---

## ⚙️ Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/xhotel.git
   cd xhotel
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup `.env` file:**

   ```env
   DATABASE_URL=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   STRIPE_SECRET_KEY=
   NEXTAUTH_SECRET=
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

---

## 📌 About

This project was built as a full-stack portfolio application to demonstrate expertise in:

- Scalable frontend architecture (Next.js App Router)
- Backend APIs & secure authentication
- Integration with third-party services (Stripe, Cloudinary)
- Full CRUD and real-time user experiences
