import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { API_FETCH_BASE } from '../config/api.js'

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const loadUser = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_FETCH_BASE}/`, { credentials: 'include' })
      if (!response.ok) {
        throw new Error('Could not load user session.')
      }

      const data = await response.json()
      setUser(data.user || null)
    } catch (sessionError) {
      setUser(null)
      setError(sessionError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setError('')

    try {
      const response = await fetch(`${API_FETCH_BASE}/logout`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to logout from backend.')
      }

      window.location.assign('/')
    } catch (logoutError) {
      setError(logoutError.message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          bgcolor: '#f4f6fb',
          px: 2,
        }}
      >
        <Paper elevation={6} sx={{ width: '100%', maxWidth: 520, p: 4, borderRadius: 3 }}>
          <Stack spacing={2.2}>
            <Box>
              <Typography variant="h5" component="h1" fontWeight={700}>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Your authenticated profile info from backend session.
              </Typography>
            </Box>

            {isLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  Loading profile...
                </Typography>
              </Stack>
            ) : null}

            {error ? <Alert severity="error">{error}</Alert> : null}

            {!isLoading && !error && !user ? (
              <Alert severity="info">No active session found. Please login first.</Alert>
            ) : null}

            {!isLoading && user ? (
              <Stack spacing={1.2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={user.picture || ''} alt={user.name || 'User'} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography fontWeight={700}>{user.name || 'Unknown user'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email || 'No email'}
                    </Typography>
                  </Box>
                </Stack>
                <Alert severity="success">Authenticated with Google successfully.</Alert>
              </Stack>
            ) : null}

            <Button variant="outlined" fullWidth href="/">
              Back to login
            </Button>
            <Button variant="text" fullWidth onClick={loadUser} disabled={isLoading}>
              Refresh info
            </Button>
            <Button variant="text" fullWidth onClick={handleLogout} disabled={!user || isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </>
  )
}

export default DashboardPage
