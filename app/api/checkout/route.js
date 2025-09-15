import Stripe from "stripe";
import { NextResponse } from "next/server";
import { PRICE_IDS } from "@/lib/products";

export async function POST(req){
  try{
    const body = await req.json();
    const items = body.items || [];
    if(!items.length) return NextResponse.json({error: "No items"}, {status: 400});

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const line_items = items.map((i) => {
      const price = PRICE_IDS[i.id];
      if(!price) throw new Error(`Unknown product id: ${i.id}`);
      return { price, quantity: i.qty || 1 };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      shipping_options: [
        { shipping_rate_data: { type: "fixed_amount", fixed_amount: {amount: 0, currency: "usd"}, display_name: "Free (orders $49+)" } },
        { shipping_rate_data: { type: "fixed_amount", fixed_amount: {amount: 799, currency: "usd"}, display_name: "Standard" } },
      ],
    });

    return NextResponse.json({ id: session.id, url: session.url });
  }catch(e){
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
