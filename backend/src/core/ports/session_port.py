from abc import ABC, abstractmethod
from typing import Any


class SessionPort(ABC):
    @abstractmethod
    def get(self, request: Any, key: str, default: Any = None) -> Any:
        raise NotImplementedError

    @abstractmethod
    def set(self, request: Any, key: str, value: Any) -> None:
        raise NotImplementedError

    @abstractmethod
    def pop(self, request: Any, key: str, default: Any = None) -> Any:
        raise NotImplementedError
