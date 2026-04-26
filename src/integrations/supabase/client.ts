import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://eauszyxpylfwphydgjlf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdXN6eXhweWxmd3BoeWRnamxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDQ4ODksImV4cCI6MjA5MjcyMDg4OX0.wJk_uwScv9Pt2EwcZWfBe_xznjHmRVArsm_wKI57ZgI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
