export default function Badge({children, className=''}){
  return <span className={`badge border-zinc-700 bg-black/50 ${className}`}>{children}</span>;
}
