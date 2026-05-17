class DatabaseError(Exception):
    pass

class EntityNotFoundError(DatabaseError):
    pass

class ProcessNotFoundError(EntityNotFoundError):
    def __init__(self, process_id: int) -> None:
        self.process_id = process_id
        super().__init__(self._build_message())

    def _build_message(self) -> str:
        return f"Process with id {self.process_id} not found"

class DeleteEntityError(DatabaseError):
    pass

class DeleteProcessDocumentsError(DeleteEntityError):
    def __init__(self, process_id: int) -> None:
        self.process_id = process_id
        super().__init__(self._build_message())

    def _build_message(self) -> str:
        return f"Could not delete documents from process with id {self.process_id}"

class DeleteProcessHourGoalsError(DeleteEntityError):
    def __init__(self, process_id: int) -> None:
        self.process_id = process_id
        super().__init__(self._build_message())

    def _build_message(self) -> str:
        return f"Could not delete hour goals from process with id {self.process_id}"

class DeleteProcessError(DeleteEntityError):
    def __init__(self, process_id: int) -> None:
        self.process_id = process_id
        super().__init__(self._build_message())

    def _build_message(self) -> str:
        return f"Could not delete process with id {self.process_id}"