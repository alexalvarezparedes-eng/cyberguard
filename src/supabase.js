import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nufobhjstnmtxookjchv.supabase.co";
const supabaseKey = "sb_publishable_1QIPIOY3x_4iOLGt-TQHUQ_4KtKZ1lO";

export const supabase = createClient(supabaseUrl, supabaseKey);