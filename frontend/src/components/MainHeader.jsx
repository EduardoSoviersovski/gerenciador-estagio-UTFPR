import { useAuth } from "../contexts/AuthContext";

export const MainHeader = () => {
    const { user, logout } = useAuth();
  return (
    <header className="w-full flex justify-between items-center bg-gray-100 border-b border-gray-300 px-[5%] py-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-red">Mensagem de aviso la e tals</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="font-medium">{user?.given_name}</span>
        <button 
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
        >
          Sair
        </button>
      </div>
    </header>
  );
};

