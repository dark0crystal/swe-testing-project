# Water Daily Tracker

A comprehensive daily water intake tracking application built with Next.js, Supabase, and Tailwind CSS. Track your hydration goals based on your weight, activity level, and weather conditions.

## Features

- **User Authentication**: Secure registration and login system
- **Profile Setup**: Configure weight, activity level, and weather conditions
- **Smart Water Calculation**: Personalized daily water goals based on user data
- **Real-time Tracking**: Log water intake throughout the day
- **Progress Visualization**: Visual progress bars and percentage tracking
- **Historical Data**: View past 7 days of water intake
- **Responsive Design**: Beautiful UI with white and #C2E7FF color scheme

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd water-daily-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `database-schema.sql` in your Supabase SQL editor
   - Get your project URL and anon key

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses three main tables:

### Users
- `id`: UUID primary key
- `name`: User's full name
- `username`: Unique username
- `password_hash`: Hashed password
- `created_at`, `updated_at`: Timestamps

### User Profiles
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `weight`: User's weight in kg
- `activity_level`: Activity level (sedentary, light, moderate, active, very_active)
- `weather_condition`: Weather condition (cool, mild, warm, hot)
- `daily_goal`: Calculated daily water goal in ml
- `created_at`, `updated_at`: Timestamps

### Water Logs
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `amount`: Water amount in ml
- `logged_at`: When the water was consumed
- `created_at`: Timestamp

## Water Calculation Formula

The daily water goal is calculated using:
- Base amount: 35ml per kg of body weight
- Activity multipliers: 1.0x to 1.4x based on activity level
- Weather adjustments: 0ml to 600ml based on temperature

## Features Overview

### Authentication Flow
1. User registration with email, password, name, and username
2. Email verification (handled by Supabase)
3. Login with email and password
4. Profile setup after first login

### Water Tracking
1. Real-time progress tracking
2. Quick-add buttons for common amounts (100ml, 200ml, 250ml, 500ml)
3. Manual entry for custom amounts
4. Visual progress indicators

### Dashboard
1. Daily progress overview
2. Historical data for last 7 days
3. Profile information display
4. Logout functionality

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Dashboard.tsx
│   ├── LoginForm.tsx
│   ├── ProfileSetupForm.tsx
│   ├── RegisterForm.tsx
│   └── WaterTracker.tsx
├── contexts/
│   └── AuthContext.tsx
└── lib/
    ├── supabase.ts
    ├── validations.ts
    └── water-calculations.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
