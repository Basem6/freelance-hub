import { GoogleLogin } from '@react-oauth/google';
import { setUser, setError } from '../../app/lib/Features/authSlice';
import api from '../../app/utils/api';
import { useAppDispatch } from '../../app/lib/hooks';
import { useRouter } from 'next/navigation';

function GoogleLoginComponent() {
    const dispatch = useAppDispatch();
    const  router = useRouter();

    const handleSuccess = async (credentialResponse) => {
    try {
        const response = await api.post('/api/auth/google', {
                code: credentialResponse.credential,
                redirectUri: window.location.origin
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Google auth failed');
        }
    
        // ✨ NEW USER - redirect to choose role
        if (data.isNewUser) {
            console.log('📝 New user detected, redirecting to choose role...');
            
            // Store Google data temporarily for the choose-role page
            sessionStorage.setItem(
                'googleData',
                JSON.stringify(data.googleData)
            );
            
            router.push('/choose-role');
            return;
        }

        // ✅ EXISTING USER - login and redirect
        dispatch(setUser(response.data.user));
        router.push('/profile');

    } catch (error) {
        console.error('Google auth error:', error);
        alert(error.message);
    }
};

    const handleError = () => {
        dispatch(setError('فشل الدخول مع جوجل'));
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
}

export default GoogleLoginComponent;