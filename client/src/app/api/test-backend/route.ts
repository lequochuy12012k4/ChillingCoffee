import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/mail`;
    
    console.log('Testing backend connection to:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.text();
      return NextResponse.json({ 
        status: 'success', 
        message: 'Backend is accessible',
        data: data
      });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Backend responded with error',
        statusCode: response.status,
        statusText: response.statusText
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to backend',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
