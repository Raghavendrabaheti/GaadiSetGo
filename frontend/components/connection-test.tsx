'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Loader2, RefreshCw, CheckCircle, XCircle, Server } from 'lucide-react';

interface HealthStatus {
    status: string;
    timestamp: string;
    uptime: string;
    database: string;
    version: string;
    environment: string;
}

interface ConnectionTestProps {
    className?: string;
}

export default function ConnectionTest({ className }: ConnectionTestProps) {
    const { isAuthenticated, user } = useAuth();
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    // Test backend connection
    const testConnection = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.healthCheck();

            if (response.success) {
                setHealth(response.data as HealthStatus);
                setLastChecked(new Date());
            } else {
                throw new Error(response.error || 'Health check failed');
            }
        } catch (err: unknown) {
            console.error('Connection test failed:', err);
            setError((err as Error).message || 'Failed to connect to backend');
            setHealth(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-test connection on component mount
    useEffect(() => {
        testConnection();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'healthy':
                return 'bg-green-500';
            case 'degraded':
                return 'bg-yellow-500';
            case 'unhealthy':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = () => {
        if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
        if (error) return <XCircle className="h-4 w-4 text-red-500" />;
        if (health?.status === 'healthy') return <CheckCircle className="h-4 w-4 text-green-500" />;
        return <Server className="h-4 w-4 text-gray-500" />;
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <CardTitle className="text-lg">Backend Connection</CardTitle>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={testConnection}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Test
                    </Button>
                </div>
                <CardDescription>
                    Real-time connection status to the FastAPI backend
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    {error ? (
                        <Badge variant="destructive">Disconnected</Badge>
                    ) : health ? (
                        <Badge className={`${getStatusColor(health.status)} text-white`}>
                            {health.status}
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Unknown</Badge>
                    )}
                </div>

                {/* Authentication Status */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Authentication:</span>
                    <Badge variant={isAuthenticated ? "default" : "secondary"}>
                        {isAuthenticated ? `Logged in as ${user?.full_name}` : 'Not authenticated'}
                    </Badge>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">
                            <strong>Connection Error:</strong> {error}
                        </p>
                        <p className="text-xs text-red-500 mt-1">
                            Make sure the backend server is running on http://127.0.0.1:8000
                        </p>
                    </div>
                )}

                {/* Health Details */}
                {health && (
                    <div className="space-y-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-medium">Version:</span>
                                <span className="ml-2 text-gray-600">{health.version}</span>
                            </div>
                            <div>
                                <span className="font-medium">Environment:</span>
                                <span className="ml-2 text-gray-600">{health.environment}</span>
                            </div>
                            <div>
                                <span className="font-medium">Database:</span>
                                <span className="ml-2 text-gray-600">{health.database}</span>
                            </div>
                            <div>
                                <span className="font-medium">Uptime:</span>
                                <span className="ml-2 text-gray-600">{health.uptime}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Last Checked */}
                {lastChecked && (
                    <div className="text-xs text-gray-500">
                        Last checked: {lastChecked.toLocaleString()}
                    </div>
                )}

                {/* API Endpoints Info */}
                <div className="text-xs text-gray-500 space-y-1">
                    <div>Backend URL: {process.env.NEXT_PUBLIC_API_URL}</div>
                    <div>Health endpoint: /health</div>
                    <div>API Documentation: {process.env.NEXT_PUBLIC_API_URL}/docs</div>
                </div>
            </CardContent>
        </Card>
    );
}
