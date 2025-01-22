import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useResetPasswordMutation } from '@/redux/slices/apiSlice';

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [resetPassword] = useResetPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setStatus('mismatch');
            return;
        }

        setStatus('loading');

        try {
            await resetPassword({ token, newPassword }).unwrap();
            setStatus('success');
            setTimeout(() => navigate('/users/login'), 2000);
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="container max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Reset Your Password</h1>

            {status === 'success' ? (
                <div className="text-green-600">
                    Password successfully reset! Redirecting to login...
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="password"
                            placeholder="New password"
                            className="bg-white"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            className='bg-white'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {status === 'mismatch' && (
                        <div className="text-red-500">Passwords do not match</div>
                    )}

                    {status === 'error' && (
                        <div className="text-red-500">
                            Failed to reset password. The link might be expired or invalid.
                        </div>
                    )}

                    <Button 
                        type="submit"
                        className="w-full bg-red-500"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            )}
        </div>
    );
}