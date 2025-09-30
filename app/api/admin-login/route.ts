import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/auth-middleware'

// Force mock credentials regardless of environment variables
const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = '12345678'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Verify admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log(`❌ Invalid admin credentials attempt: ${email}`)
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create admin session token
    const sessionToken = await createAdminSession()
    
    console.log('✅ Admin login successful')

    // Set secure cookie with the session token
    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful'
    })

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    console.log('🚪 Admin logout requested')
    
    // Clear admin session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}