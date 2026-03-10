import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nufobhjstnmtxookjchv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Zm9iaGpzdG5tdHhvb2tqY2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ3MTEsImV4cCI6MjA4ODY2MDcxMX0.ihB3O1QqfpF1dLSTJhyroGBqaWlm_ampLX7r1pvqX0M"; 
export const supabase = createClient(supabaseUrl, supabaseKey);