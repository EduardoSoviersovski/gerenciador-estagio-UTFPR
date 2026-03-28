from abc import ABC, abstractmethod
from typing import Any, List, Optional, Dict

class DatabasePort(ABC):
    @abstractmethod
    def execute_query(self, query: str, params: Optional[tuple] = None) -> None:
        raise NotImplementedError

    @abstractmethod
    def fetch_one(self, query: str, params: Optional[tuple] = None) -> Optional[Dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def fetch_list(self, query: str, params: Optional[tuple] = None) -> List[Dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def get_connection(self) -> Any:
        raise NotImplementedError
