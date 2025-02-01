import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/login-form';
import userEvent from '@testing-library/user-event';



jest.mock('@/redux/slices/apiSlice', ()=>({
    useLoginMutation: ()=>[jest.fn(), {isLoading: false}],
}));

jest.mock('react-router', ()=>({
    ...jest.requireActual('react-router'),
    useNavigate: ()=> jest.fn(),
}));

jest.mock('react-redux', ()=>({
    useDispatch: () => jest.fn(),
}));

describe('LoginForm Component', ()=>{
    it('renders the login form correctly', ()=>{
        render(<LoginForm setIsForgotPassword={jest.fn()}/>);

        expect(screen.getByRole('heading', {name: /login to your account/i})).toBeInTheDocument();

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        
        const buttons = screen.getAllByRole('button');
        
        const submitLoginButton = buttons.find(
            button => button.textContent === 'Login' && button.getAttribute('type') === 'submit'
        );
        expect(submitLoginButton).toBeInTheDocument();

        const googleLoginButton = screen.getByRole('button', {name: /login with google/i});
        expect(googleLoginButton).toBeInTheDocument();

        const guestLoginButton = screen.getByRole('button', {name: /continue as guest/i});
        expect(guestLoginButton).toBeInTheDocument();
    });

    it('handles user input correctly', async() => {
        render(<LoginForm setIsForgotPassword={jest.fn()} />);
    
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
    
        await userEvent.type(emailInput, 'test@example.com');
        expect(emailInput).toHaveValue('test@example.com');
    
        await userEvent.type(passwordInput, 'password123');
        expect(passwordInput).toHaveValue('password123');
      });


    it('submits the form successfully', async()=>{
        const mockLogin = jest.fn().mockResolvedValue({data: {id: 1, name: 'John Snow', email: 'test@example.com'}});

        jest.spyOn(require('@/redux/slices/apiSlice'), 'useLoginMutation').mockReturnValue([mockLogin, {isLoading: false}]);

        const mockDispatch = jest.fn();
        jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

        render(<LoginForm setIsForgotPassword={jest.fn()} />);

        const buttons = screen.getAllByRole('button');

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = buttons.find(
            button => button.textContent === 'Login' && button.getAttribute('type') === 'submit'
        );

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(loginButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
    });
    

    });
      
    
});

