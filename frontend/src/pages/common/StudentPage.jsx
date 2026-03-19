import { BaseButton } from "../../components/BaseButton";

export const StudentPage = ({ actions }) => {
  return (
    <div className="w-full max-w-[600px] mt-8 flex flex-col gap-4">
      <div className="flex gap-4 w-full">

        <BaseButton
          text="Relatórios"
          onClick={actions.onReports}
          colorClass="bg-blue-600"
          size="lg"
        />
        <BaseButton
          text="Documentos"
          onClick={actions.onDocuments}
          colorClass="bg-green-600"
          size="lg"
        />
      </div>

      <BaseButton
        text="Auditoria"
        onClick={actions.onLog}
        colorClass="bg-slate-700"
        fullWidth={true}
        size="md"
      />
    </div>
  );
};