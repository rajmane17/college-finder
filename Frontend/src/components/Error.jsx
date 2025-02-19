
const Error = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <h2 style={{
        fontSize: '3rem',
        color: '#343a40',
        marginBottom: '1rem',
        fontFamily: 'Arial, sans-serif'
      }}>404</h2>
      <p style={{
        fontSize: '1.5rem',
        color: '#6c757d',
        textAlign: 'center'
      }}>Oops! Page not found</p>
    </div>
  )
}

export default Error
