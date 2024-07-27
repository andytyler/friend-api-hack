import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	"https://ttkavmlcvjqaywhgocig.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0a2F2bWxjdmpxYXl3aGdvY2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMjE2MjksImV4cCI6MjAzNzY5NzYyOX0.37ScV2ClbfgBVSUzKWzQDebDafY6g9rP9O1TLIszFD8"
);
