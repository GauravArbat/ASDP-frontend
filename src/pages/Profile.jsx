import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function Profile(){
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [avatarFile, setAvatarFile] = useState(null)
	const [avatarUrl, setAvatarUrl] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
    const navigate = useNavigate()
    const { refresh } = useAuth()

    // Load current user to prefill
    useEffect(()=>{
        (async ()=>{
            try{
                const res = await fetch('/api/auth/me', { credentials:'include' })
                const data = await res.json()
                if(!res.ok || !data.is_authenticated){
                    navigate('/login')
                    return
                }
                setUsername(data.user.username || '')
                setEmail(data.user.email || '')
                setAvatarUrl(data.user.profile_image || '')
            }catch{
                setError('Failed to load profile')
            }
        })()
    }, [navigate])

	async function onSubmit(e){
		e.preventDefault()
		setError(''); setSuccess('')
		try{
			// Handle avatar upload separately if needed
			if(avatarFile) {
				const avatarForm = new FormData()
				avatarForm.append('avatar', avatarFile)
				const avatarRes = await fetch('/api/auth/avatar', { method:'POST', body: avatarForm, credentials:'include' })
				if(!avatarRes.ok){
					const text = await avatarRes.text(); throw new Error(text || `HTTP ${avatarRes.status}`)
				}
			}
			
			// Update profile data
			const res = await fetch('/api/auth/profile', { 
				method:'POST', 
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password }),
				credentials:'include' 
			})
			const data = await res.json()
			if(!res.ok){
				throw new Error(data.error || `HTTP ${res.status}`)
			}
			setSuccess('Profile updated')
			setPassword('')
            try{
                await refresh()
                const resMe = await fetch('/api/auth/me', { credentials:'include' })
                const dataMe = await resMe.json()
                if(resMe.ok && dataMe.is_authenticated){
                    setUsername(dataMe.user.username || '')
                    setEmail(dataMe.user.email || '')
                    setAvatarUrl(dataMe.user.profile_image || '')
                }
            }catch{
                // Continue if refresh fails
            }
		}catch(err){ setError(err.message) }
	}

	return (
		<div>
			<Navbar />
			<div className="container py-4" style={{maxWidth:720}}>
			<div className="card shadow-sm" style={{borderRadius:16}}>
				<div className="card-body">
					<h4 className="mb-3 d-flex align-items-center justify-content-between">Edit profile <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>window.history.back()}>Back</button></h4>
					{error && <div className="alert alert-danger">{error}</div>}
					{success && <div className="alert alert-success">{success}</div>}
					<form onSubmit={onSubmit} encType="multipart/form-data">
						<div className="mb-3">
							<label className="form-label">Profile picture</label>
							{avatarUrl ? (
								<div className="mb-2"><img src={avatarUrl} alt="avatar" style={{width:96,height:96,objectFit:'cover',borderRadius:'50%'}}/></div>
							) : null}
							<input className="form-control" type="file" accept="image/*" onChange={(e)=> setAvatarFile(e.target.files?.[0] || null)} />
						</div>
						<div className="mb-3">
							<label className="form-label">Username</label>
							<input className="form-control" value={username} onChange={(e)=>setUsername(e.target.value)} required />
						</div>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input className="form-control" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
						</div>
						<div className="mb-3">
							<label className="form-label">New password (optional)</label>
							<input className="form-control" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
						</div>
						<button className="btn btn-primary">Save changes</button>
					</form>
				</div>
			</div>
			</div>
		</div>
	)
}



