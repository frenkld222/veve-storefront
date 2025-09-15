export function Card({className='', children}){
  return <div className={`card ${className}`}>{children}</div>;
}
export function CardHeader({children, className=''}){ return <div className={`p-6 ${className}`}>{children}</div>; }
export function CardContent({children, className=''}){ return <div className={`px-6 pb-6 ${className}`}>{children}</div>; }
export function CardFooter({children, className=''}){ return <div className={`px-6 pb-6 ${className}`}>{children}</div>; }
export function CardTitle({children, className=''}){ return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>; }
export function CardDescription({children, className=''}){ return <p className={`text-sm text-zinc-400 ${className}`}>{children}</p>; }
