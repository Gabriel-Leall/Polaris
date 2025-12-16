# Supabase Database Setup

This directory contains the database schema and setup instructions for the Polaris application.

## Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Run Database Schema**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy and paste the contents of `schema.sql`
   - Execute the SQL to create all tables and policies

4. **Enable Authentication**
   - In Supabase dashboard, go to Authentication > Settings
   - Configure your preferred authentication providers
   - Enable email confirmation if desired

## Database Structure

### Tables

- **profiles**: User profile information (extends auth.users)
- **tasks**: Task management with user association
- **job_applications**: Job tracking with status management
- **user_preferences**: User personalization settings
- **brain_dump_notes**: Scratchpad content with versioning

### Security

All tables implement Row Level Security (RLS) policies to ensure users can only access their own data.

### Features

- Automatic timestamp updates via triggers
- UUID primary keys for all tables
- Foreign key constraints for data integrity
- Proper indexing for performance
- Type-safe TypeScript interfaces

## Development

The database types are automatically generated and available in `src/types/index.ts`. The Supabase client is configured in `src/lib/supabase.ts` with full TypeScript support.