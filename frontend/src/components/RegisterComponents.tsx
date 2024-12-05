'use client';

import React, { useState } from 'react';
import { Envelope, Lock, User } from 'phosphor-react';
import { Button, InputIcon, Input, Label } from 'keep-react';

export const RegisterComponent: React.FC = () => {
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Vérifier si les champs sont remplis
        if (!firstname || !lastname || !email || !password) {
            setMessage('All fields are required!');
            return;
        }

        try {
            // Envoi des données au backend Symfony
            const response = await fetch('http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstname,
                    last_name: lastname,
                    email,
                    password,
                }),
            });

            // Vérification de la réponse du backend
            if (response.ok) {
                setMessage('User registered successfully!');
                setFirstname('');
                setLastname('');
                setEmail('');
                setPassword('');
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message || 'Failed to register'}`);
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
        }
    };
    console.log('Submitting data:', {
        first_name: firstname,
        last_name: lastname,
        email,
        password,
    });
    
    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md space-y-4 rounded-lg border p-8 shadow-md"
        >
            <fieldset className="space-y-1">
                <Label htmlFor="firstname">First Name</Label>
                <div className="relative">
                    <Input
                        id="firstname"
                        placeholder="Enter first name"
                        className="ps-11"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <InputIcon>
                        <User size={19} color="#AFBACA" />
                    </InputIcon>
                </div>
            </fieldset>
            <fieldset className="space-y-1">
                <Label htmlFor="lastname">Last Name</Label>
                <div className="relative">
                    <Input
                        id="lastname"
                        placeholder="Enter last name"
                        className="ps-11"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <InputIcon>
                        <User size={19} color="#AFBACA" />
                    </InputIcon>
                </div>
            </fieldset>
            <fieldset className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Input
                        id="email"
                        placeholder="Enter email"
                        className="ps-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputIcon>
                        <Envelope size={19} color="#AFBACA" />
                    </InputIcon>
                </div>
            </fieldset>
            <fieldset className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        placeholder="Enter password"
                        type="password"
                        className="ps-11"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputIcon>
                        <Lock size={19} color="#AFBACA" />
                    </InputIcon>
                </div>
            </fieldset>
            <Button size="sm" color="secondary" type="submit">
                Register
            </Button>
            {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        </form>
    );
};
 