# Supabase Setup Guide

This guide walks you through setting up Supabase for the Polaris application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and Bun installed locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `polaris-dashboard` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)

## Step 3: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- All necessary tables (`profiles`, `tasks`, `job_applications`, `user_preferences`, `brain_dump_notes`)
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamp triggers

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Configure your preferred authentication providers:
   - **Email**: Enable email authentication
   - **Social Providers**: Optionally enable Google, GitHub, etc.
3. Set up email templates if using email authentication
4. Configure redirect URLs for your application:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## Step 6: Test the Connection

1. Start your development server:
   ```bash
   bun dev
   ```

2. Run the environment variable validation test:
   ```bash
   bun test src/__tests__/environment-variable-validation.test.ts --run
   ```

3. Check that the Supabase client initializes without errors

## Step 7: Verify Database Access

You can test database connectivity by running a simple query in the SQL Editor:

```sql
SELECT * FROM auth.users LIMIT 1;
```

## Security Notes

- **Never commit your `.env.local` file** - it's already in `.gitignore`
- The **anon key** is safe to use in client-side code - it respects RLS policies
- The **service role key** should never be used in client-side code
- All tables have RLS enabled, so users can only access their own data

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Check that your `.env.local` file exists and has the correct variable names
   - Restart your development server after adding environment variables

2. **"Invalid Supabase URL format" error**
   - Ensure your URL starts with `https://` and ends with `.supabase.co`
   - Check for any extra spaces or characters

3. **"Invalid Supabase anon key format" error**
   - Ensure you copied the full anon key (it should be very long)
   - Make sure you're using the anon key, not the service role key

4. **Database connection issues**
   - Verify your project is active in the Supabase dashboard
   - Check that the schema was applied successfully
   - Ensure RLS policies are enabled

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Review the application logs for specific error messages

## Next Steps

Once Supabase is set up, you can:
1. Implement Server Actions for data operations (Task 7)
2. Migrate widgets to use Supabase for persistence
3. Set up authentication flows
4. Test the complete application workflow