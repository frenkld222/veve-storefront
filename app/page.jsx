'use client';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Star, Truck, CreditCard, Menu, Sparkles, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import { PRODUCTS } from '@/lib/products';

const THEME = { pink: '#ff4f9a', gold: '#d4af37', black: '#0a0a0b' };

function useCart(){
  const [items, setItems] = useState([]);
  const add = (p, qty=1) => setItems(prev => {
    const f = prev.find(i => i.id===p.id);
    return f ? prev.map(i => i.id===p.id ? {...i, qty: i.qty+qty}: i) : [...prev, { id: p.id, name: p.name, price: p.price, qty, img: p.img }];
  });
  const remove = (id) => setItems(prev => prev.filter(i => i.id!==id));
  const setQty = (id, delta) => setItems(prev => prev.map(i => i.id===id ? {...i, qty: Math.max(1, i.qty+delta)}: i));
  const subtotal = useMemo(() => items.reduce((s,i)=> s + i.price*i.qty, 0), [items]);
  return { items, add, remove, setQty, subtotal };
}

function StarRow({ rating = 5 }){
  return (
    <div className="flex items-center gap-1">
      {Array.from({length:5}).map((_,i)=>(
        <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-yellow-400' : 'opacity-30'}`} />
      ))}
      <span className="ml-1 text-xs text-zinc-400">{rating.toFixed(1)}</span>
    </div>
  );
}

function Price({ cents }){ return <span className="font-semibold">${(cents/100).toFixed(2)}</span>; }

export default function Home(){
  const cart = useCart();
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(7000);
  const [activeTags, setActiveTags] = useState([]);
  const [featured, setFeatured] = useState(PRODUCTS[1]);

  const tags = useMemo(()=> Array.from(new Set(PRODUCTS.flatMap(p=>p.tags))).sort(), []);
  const filtered = PRODUCTS.filter((p)=>{
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.blurb.toLowerCase().includes(query.toLowerCase());
    const matchPrice = p.price <= maxPrice;
    const matchTags = activeTags.length ? activeTags.every(t=>p.tags.includes(t)) : true;
    return matchQuery && matchPrice && matchTags;
  });

  async function checkout(){
    if(!cart.items.length) return alert('Your cart is empty.');
    const res = await fetch('/api/checkout', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ items: cart.items }) });
    const data = await res.json();
    if(data?.url){ window.location.href = data.url; }
    else{ alert(data?.error || 'Checkout error'); }
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-40 backdrop-blur bg-black/60 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden veve-btn-outline"><Menu /></button>
            <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full" style={{background: `conic-gradient(from 180deg, ${THEME.gold}, ${THEME.pink}, ${THEME.gold})`}} />
              <span className="text-xl font-black tracking-widest veve-gold">VEVE</span>
              <span className="badge border-pink-500 text-pink-200 bg-pink-600/20 ml-2">Premium Dark</span>
            </motion.div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Input placeholder="Search chocolates..." value={query} onChange={e=>setQuery(e.target.value)} className="w-72" />
            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400">
              <Truck className="h-4 w-4"/><span>Free shipping $49+</span>
            </div>
          </div>
          <button className="veve-btn-primary" onClick={()=>document.getElementById('cart').scrollIntoView({behavior:'smooth'})}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Cart ({cart.items.reduce((s,i)=>s+i.qty,0)})
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-600/10 px-3 py-1 text-pink-200">
              <Sparkles className="h-4 w-4"/> Premium dark that tastes like milk
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-black leading-[1.05] veve-gold">VEVE Chocolat</h1>
            <p className="mt-4 text-lg text-zinc-300 max-w-prose">Indulgent, ultra-smooth dark chocolates crafted to deliver a creamy, milk-like finish—without compromising depth or cocoa character.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#shop"><button className="veve-btn-primary">Shop Collection <ChevronRight className="ml-1 h-4 w-4"/></button></a>
              <a href="#cart"><button className="veve-btn-outline">View Cart</button></a>
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay:0.1}} className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-800" style={{background: `linear-gradient(140deg, #0a0a0b, #1a1a1f 60%, rgba(212,175,55,0.15))`}}>
              <img src="https://images.unsplash.com/photo-1612208695882-02f94022a4a6?q=80&w=1200&auto=format&fit=crop" alt="VEVE hero chocolate" className="h-full w-full object-cover opacity-90" />
            </div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} className="absolute -bottom-6 -left-6 -rotate-6">
              <span className="badge veve-gold-bg text-black">Gold Dusted</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4" id="shop">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold veve-gold">All Chocolates</h2>
          <div className="mt-3 flex items-center gap-3">
            <Input placeholder="Search..." value={query} onChange={e=>setQuery(e.target.value)} className="w-60" />
            <span className="text-sm text-zinc-400">{filtered.length} items</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p)=>(
            <ProductCard key={p.id} p={p} onAdd={()=>cart.add(p)} />
          ))}
        </div>
      </section>

      {/* Cart */}
      <section id="cart" className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-bold veve-gold">Your Cart</h2>
        {!cart.items.length ? <p className="mt-3 text-zinc-400">Your cart is empty.</p>:
          <div className="mt-6 space-y-4">
            {cart.items.map(i => (
              <div key={i.id} className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <img src={i.img} alt={i.name} className="h-16 w-16 rounded-lg object-cover"/>
                <div className="flex-1">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-sm text-zinc-400"><Price cents={i.price}/></div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-zinc-700">
                    <button className="veve-btn-outline" onClick={()=>cart.setQty(i.id,-1)}><Minus className="h-4 w-4"/></button>
                    <span className="px-2">{i.qty}</span>
                    <button className="veve-btn-outline" onClick={()=>cart.setQty(i.id,+1)}><Plus className="h-4 w-4"/></button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold"><Price cents={i.price * i.qty}/></div>
                  <button className="text-zinc-400 hover:text-zinc-100" onClick={()=>cart.remove(i.id)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <div className="text-lg">Subtotal: <span className="font-semibold"><Price cents={cart.subtotal}/></span></div>
              <button className="veve-btn-primary" onClick={checkout}><CreditCard className="mr-2 h-4 w-4"/> Checkout</button>
            </div>
            <p className="text-xs text-zinc-500">Secure Stripe Checkout. Taxes and shipping calculated at checkout.</p>
          </div>
        }
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full" style={{background: `conic-gradient(from 180deg, ${THEME.gold}, ${THEME.pink}, ${THEME.gold})`}} />
              <span className="font-black veve-gold">VEVE</span>
            </div>
            <p className="mt-3 text-zinc-400">Premium dark with a milk-like finish. Crafted in small batches.</p>
          </div>
          <div>
            <div className="font-semibold mb-2 veve-gold">Shop</div>
            <ul className="space-y-1 text-zinc-300">
              <li>Bars</li><li>Truffles</li><li>Gifts</li><li>Corporate</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 veve-gold">Company</div>
            <ul className="space-y-1 text-zinc-300">
              <li>About VEVE</li><li>Ingredients & Allergens</li><li>Wholesale</li><li>Contact</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 veve-gold">Get in touch</div>
            <p className="text-zinc-300">hello@vevechocolat.com</p>
          </div>
        </div>
        <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">© {new Date().getFullYear()} VEVE Chocolat. All rights reserved.</div>
      </footer>
    </div>
  );
}

function ProductCard({ p, onAdd }){
  return (
    <div className="card overflow-hidden">
      <div className="relative">
        <img src={p.img} alt={p.name} className="h-52 w-full object-cover" />
        <span className="badge absolute left-2 top-2 border-zinc-700 bg-black/70">{p.weight}</span>
      </div>
      <div className="p-6">
        <h3 className="text-base font-semibold">{p.name}</h3>
        <p className="text-sm text-zinc-400 mt-1">{p.blurb}</p>
        <div className="flex items-center justify-between mt-4">
          <StarRow rating={p.rating} />
          <div className="text-lg"><Price cents={p.price}/></div>
        </div>
        <button className="veve-btn-primary w-full mt-4" onClick={onAdd}>Add to cart</button>
      </div>
    </div>
  );
}
