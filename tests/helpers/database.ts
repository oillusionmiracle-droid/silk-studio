import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
export const customerId = "10000000-0000-4000-8000-000000000001";
export const otherId = "10000000-0000-4000-8000-000000000002";
export const adminId = "10000000-0000-4000-8000-000000000003";
export const variantId = "20000000-0000-4000-8000-000000000001";
export const productId = "30000000-0000-4000-8000-000000000001";
export async function database() {
  const db = new PGlite();
  // Production-shaped schema: variants intentionally have NO price or name.
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
    CREATE TABLE auth.users(id uuid PRIMARY KEY,raw_user_meta_data jsonb DEFAULT '{}');
    CREATE TABLE public.profiles(id uuid PRIMARY KEY REFERENCES auth.users(id),full_name text,avatar_url text,role text NOT NULL DEFAULT 'customer');
    CREATE TABLE public.products(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text,title text,slug text,category text,price integer,is_active boolean DEFAULT true,is_custom_quote boolean DEFAULT false,pricing_type text DEFAULT 'tier',config_schema jsonb DEFAULT '{}');
    CREATE TABLE public.variants(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),product_id uuid REFERENCES products(id),stock integer DEFAULT 0,options jsonb DEFAULT '{}');
    CREATE TABLE public.orders(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid REFERENCES auth.users(id),type text,customer_name text,email text,phone text,address text,area text,subtotal integer,delivery_fee integer,total integer,server_verified_amount numeric,status text,paystack_ref text,reference_files jsonb,specs jsonb,status_history jsonb DEFAULT '[]',admin_notes text,created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now());
    CREATE TABLE public.order_items(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),order_id uuid REFERENCES orders(id),variant_id uuid REFERENCES variants(id),quantity integer,price_at_purchase integer);
    GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
    INSERT INTO auth.users(id) VALUES('${customerId}'),('${otherId}'),('${adminId}');
    INSERT INTO profiles(id,role) VALUES('${customerId}','customer'),('${otherId}','customer'),('${adminId}','admin');
    INSERT INTO products(id,name,title,slug,category,price) VALUES('${productId}','Test Tee','Test Tee','test-tee','tee',20000);
    INSERT INTO variants(id,product_id,stock) VALUES('${variantId}','${productId}',20);
  `);
  const folder = join(process.cwd(), "supabase/migrations");
  const file = readdirSync(folder).find((f) =>
    f.endsWith("_security_payment_transactions.sql"),
  )!;
  await db.exec(readFileSync(join(folder, file), "utf8"));
  return db;
}
// Executes the real RPC SQL and reads real fixture tables. Only auth/provider boundaries are stubbed.
export function client(db: PGlite) {
  return {
    auth: {
      getUser: async (token: string) =>
        token === "customer-token"
          ? { data: { user: { id: customerId } }, error: null }
          : { data: { user: null }, error: new Error("Invalid token") },
    },
    rpc: async (name: string, args: Record<string, unknown>) => {
      if (!/^[a-z_]+$/.test(name)) throw new Error("Invalid function");
      const entries = Object.entries(args);
      try {
        const result = await db.query<{ value: any }>(
          `SELECT public.${name}(${entries.map(([key], i) => `${key} := $${i + 1}`).join(",")}) AS value`,
          entries.map(([, value]) =>
            typeof value === "object" && value !== null
              ? JSON.stringify(value)
              : value,
          ),
        );
        return { data: result.rows[0].value, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    from: (table: string) => {
      const filters: Array<[string, unknown]> = [];
      let ids: string[] | null = null;
      let single = false;
      let selected = "*";
      const execute = async () => {
        const args: any[] = [];
        const clauses: string[] = [];
        for (const [key, value] of filters) {
          args.push(value);
          clauses.push(`t.${key}=$${args.length}`);
        }
        if (ids) {
          args.push(ids);
          clauses.push(`t.id=ANY($${args.length}::uuid[])`);
        }
        const joinProduct = selected.includes("products(");
        const sql = `SELECT t.*${joinProduct ? ",to_jsonb(p) AS products" : ""} FROM public.${table} t ${joinProduct ? "JOIN public.products p ON p.id=t.product_id" : ""} ${clauses.length ? "WHERE " + clauses.join(" AND ") : ""}`;
        try {
          const result = await db.query(sql, args);
          return {
            data: single ? (result.rows[0] ?? null) : result.rows,
            error: null,
          };
        } catch (error) {
          return { data: null, error };
        }
      };
      const builder: any = {
        select: (s: string) => {
          selected = s;
          return builder;
        },
        eq: (key: string, value: unknown) => {
          filters.push([key, value]);
          return builder;
        },
        in: (_key: string, value: string[]) => {
          ids = value;
          return builder;
        },
        maybeSingle: () => {
          single = true;
          return execute();
        },
        then: (resolve: any, reject: any) => execute().then(resolve, reject),
      };
      return builder;
    },
  };
}
