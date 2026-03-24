import React from 'react';
import { authService } from '../../services/authService';
import { GoogleIcon } from '../../assets/GoogleIcon';

export const Login = () => {
  const handleSignIn = () => {
    try {
      const loginUrl = authService.getLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      alert("Erro ao redirecionar para o login.");
    }
  };

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 overflow-y-auto">
      <div className="w-full max-w-md p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dudu Bonitão</h1>
            <p className="text-gray-600">Gestão de Estágios UTFPR</p>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-all hover:shadow-md active:scale-95"
          >
            <GoogleIcon />
            Entre com a sua conta Google
          </button>

          <div className="mt-8 text-center text-xs text-gray-400">
            Utilize seu e-mail institucional @alunos.utfpr.edu.br
          </div>
        </div>
      </div>
    </div>
  );
};
