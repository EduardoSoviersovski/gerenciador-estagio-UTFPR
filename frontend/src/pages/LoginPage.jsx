import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { API_BASE_URL, API_FETCH_BASE } from '../config/api.js'

function LoginPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const loadSession = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_FETCH_BASE}/`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to read session from backend.')
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
    loadSession()
  }, [])

  const handleLogin = () => {
    window.location.assign(`${API_BASE_URL}/login`)
  }

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

      setUser(null)
      await loadSession()
    } catch (logoutError) {
      setError(logoutError.message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isAuthenticated = Boolean(user)

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
        <Paper elevation={6} sx={{ width: '100%', maxWidth: 460, p: 4, borderRadius: 3 }}>
          <Stack spacing={2.2}>
            <Box>
              <Typography variant="h5" component="h1" fontWeight={700}>
                Login
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Authenticate with Google via FastAPI OAuth and return to this page.
              </Typography>
            </Box>

            {isLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  Checking session...
                </Typography>
              </Stack>
            ) : null}

            {error ? <Alert severity="error">{error}</Alert> : null}

            {!isLoading && !error && !isAuthenticated ? (
              <Alert severity="info">
                You are not logged in yet. Continue with Google to access the dashboard.
              </Alert>
            ) : null}

            {!isLoading && isAuthenticated ? (
              <Alert severity="success">
                Logged in as {user.name} ({user.email})
              </Alert>
            ) : null}

            <Button variant="contained" size="large" fullWidth onClick={handleLogin}>
              Continue with Google
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              href="/dashboard"
              disabled={!isAuthenticated || isLoading}
            >
              Open dashboard
            </Button>

            <Button variant="text" fullWidth onClick={handleLogout} disabled={!isAuthenticated || isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>

            <Button variant="text" fullWidth onClick={loadSession} disabled={isLoading}>
              Refresh session status
            </Button>

            <Typography variant="caption" color="text.secondary" textAlign="center">
              API base: {API_BASE_URL}
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </>
  )
}

export default LoginPage
