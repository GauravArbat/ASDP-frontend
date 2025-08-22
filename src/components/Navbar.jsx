import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function Navbar(){
	const { user, authenticated, logout } = useAuth()
	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm mb-3" style={{background:'#fff'}}>
			<div className="container">
				<Link className="navbar-brand" to="/"><i className="fas fa-chart-line me-2"></i>ASDP</Link>
				<div className="ms-auto d-flex align-items-center gap-2">
					{authenticated ? (
						<>
							<span className="badge bg-light text-dark"><i className="fas fa-user me-1"></i>{user.username}</span>
							<Link className="btn btn-outline-secondary btn-sm" to="/profile">Profile</Link>
							{user.role === 'admin' && (<Link className="btn btn-warning btn-sm" to="/admin">Admin</Link>)}
							<button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
						</>
					) : (
						<>
							<Link className="btn btn-light btn-sm" to="/login">Login</Link>
							<Link className="btn btn-outline-primary btn-sm" to="/register">Register</Link>
							<Link className="btn btn-warning btn-sm" to="/admin">Admin</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}








