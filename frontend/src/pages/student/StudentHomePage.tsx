import React from 'react';
// Update the import path if AuthContext is located in src/contexts/AuthContext.tsx
import { useAuth } from "../../contexts/AuthContext";

export const StudentHomePage = () => {
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div>
                <h1>Bem-vindo, {user?.name || 'Estudante'}!</h1>
                <p>Esta é a sua página inicial</p>
            </div>
            
            <div style={{ marginTop: '20px' }}>
                <button 
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Sair da conta
                </button>
            </div>
        </div>
    );
}