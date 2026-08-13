# Production-Quality Airbnb Clone — Full-Stack SDE Portfolio Assignment

A full-stack, functional accommodation marketplace inspired by Airbnb, built with **Next.js 14 (TypeScript, App Router, Tailwind CSS)** on the frontend and **Django 5 + Django REST Framework + SQLite** on the backend.

---

## Technical Stack & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 14 Frontend (App Router)            │
│  TypeScript • Tailwind CSS • Axios • Lucide Icons • Toast   │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST APIs (JSON / JWT Cookies)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Django 5 Backend & Django REST Framework        │
│  Custom User • SimpleJWT • Services Layer • django-filter   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Django ORM / Transactions
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite Relational Database                │
└─────────────────────────────────────────────────────────────┘
```

### Stack Highlights
- **Frontend**: Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, Axios, React Hot Toast.
- **Backend**: Python 3.14 / Django 5.x, Django REST Framework, SimpleJWT, django-cors-headers, django-filter, drf-spectacular.
- **Database**: SQLite (Normalized relational database with transactional row locking).

---

## Database Architecture & Schema (Mermaid ERD)

```mermaid
erDiagram
    User ||--o{ Listing : "hosts"
    User ||--o{ Booking : "makes"
    User ||--o{ Review : "writes"
    User ||--o{ Favorite : "saves"
    Listing ||--o{ ListingImage : "has"
    Listing ||--o{ ListingAmenity : "has"
    Amenity ||--o{ ListingAmenity : "in"
    Listing ||--o{ Booking : "receives"
    Listing ||--o{ Review : "receives"
    Listing ||--o{ Favorite : "bookmarked"
    Booking ||--o| Review : "has"

    User {
        uuid id PK
        string email UK
        string password
        string name
        string role "GUEST | HOST | ADMIN"
        string profile_image
        text bio
    }

    Listing {
        uuid id PK
        uuid host_id FK
        string title
        string property_type
        string city
        string country
        decimal price_per_night
        decimal cleaning_fee
        decimal service_fee
        int max_guests
        decimal rating
    }

    Booking {
        uuid id PK
        uuid listing_id FK
        uuid guest_id FK
        date check_in
        date check_out
        int guests
        decimal total_price
        string status "CONFIRMED | CANCELLED | COMPLETED"
    }

    Review {
        uuid id PK
        uuid listing_id FK
        uuid user_id FK
        uuid booking_id FK UK
        int rating
        text comment
    }

    Favorite {
        uuid id PK
        uuid user_id FK
        uuid listing_id FK
    }
```

---

## Core Features & Workflow

### 1. Booking Availability & Concurrency Strategy
- **Overlap Rule**: A booking overlaps another if and only if:
  $$\text{new\_check\_in} < \text{existing\_check\_out} \quad \text{AND} \quad \text{new\_check\_out} > \text{existing\_check\_in}$$
- **Concurrency Locking**: Utilizes `transaction.atomic()` and `Listing.objects.select_for_update().get(id=listing_id)` during reservation creation to avoid double-booking race conditions.
- **Server-Side Pricing**: Prices are strictly computed on the Django backend (`nights * price_per_night + cleaning_fee + service_fee`). Client price inputs are ignored.

### 2. Marketplace & Search
- Sticky floating search bar with location, check-in, check-out, and guest inputs.
- Category pill selector (Beachfront, Villas, Cabins, Iconic Cities, Pools, Mansions, Treehouses).
- Photo-first responsive cards with favorite heart toggles, star ratings, and smooth hover effects.

### 3. Listing Details & Booking Card
- Desktop primary photo grid + mobile swipeable gallery + full-screen photo modal viewer.
- Sticky checkout widget with live stay cost calculations before reserving.

### 4. Host Dashboard & Management
- Analytics metric widgets (Total Revenue, Listings, Confirmed Bookings, Average Rating).
- Property creation wizard (`/host/listings/new`) with photo URLs, amenity pickers, and live publishing.

---

## Getting Started (Local Development)

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations and seed data
python manage.py makemigrations accounts listings bookings reviews favorites seed
python manage.py migrate
python manage.py seed_data

# Start server
python manage.py runserver 8000
```
Backend API will run at `http://localhost:8000/api/` with Swagger UI at `http://localhost:8000/api/docs/`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application will run at `http://localhost:3000`.

---

## Demo Accounts for Testing & Evaluation

| Role | Email | Password |
| :--- | :--- | :--- |
| **Guest** | `john@example.com` | `password123` |
| **Host** | `sarah@example.com` | `password123` |
| **Admin** | `admin@example.com` | `adminpassword` |

---

## Running Test Suite

Run backend automated tests (including all 4 mandatory booking overlap test cases):
```bash
cd backend
./venv/bin/python manage.py test accounts listings bookings
```
