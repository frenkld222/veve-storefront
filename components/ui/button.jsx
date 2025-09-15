export default function Button({ as='button', className='', children, ...props }){
  const El = as;
  return <El className={`veve-btn ${className}`} {...props}>{children}</El>
}
