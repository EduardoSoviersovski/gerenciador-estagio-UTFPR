import { FileText, FolderOpen, History } from 'lucide-react';
import { ActionCard } from './ui/ActionCard';

interface ActionMenuProps {
  actions: {
    onReports: () => void;
    onDocuments: () => void;
    onLog: () => void;
  };
}

export const ActionMenu = ({ actions }: ActionMenuProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-8">

      <ActionCard
        title="Relatórios"
        description="Gerencie seus relatórios e acompanhe os prazos de entrega."
        icon={<FileText size={24} />}
        colorClass="bg-blue-600"
        onClick={actions.onReports}
      />

      <ActionCard
        title="Documentos"
        description="Anexe seus arquivos ao sistema."
        icon={<FolderOpen size={24} />}
        colorClass="bg-emerald-600"
        onClick={actions.onDocuments}
      />

      <ActionCard
        title="Auditoria"
        description="Verifique o histórico de todas as alterações realizadas no sistema."
        icon={<History size={24} />}
        colorClass="bg-slate-700"
        onClick={actions.onLog}
      />

    </div>
  );
};