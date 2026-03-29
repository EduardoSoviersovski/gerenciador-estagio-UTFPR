import React, { useState, ChangeEvent, FormEvent } from 'react';

interface AddActivityFormProps {
  onAddStep: (title: string) => void;
}

export const AddActivityForm = ({ onAddStep }: AddActivityFormProps) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddStep(newTitle);
    setNewTitle('');
    setIsAdding(false);
  };

  // Tipamos o evento de mudança do input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
      >
        + Nova Atividade
      </button>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex gap-2 animate-in fade-in slide-in-from-right-4"
    >
      <input
        autoFocus
        type="text"
        placeholder="Nome da atividade..."
        value={newTitle}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Confirmar
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setNewTitle('');
          }}
          className="text-gray-500 hover:text-gray-700 px-2 text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};