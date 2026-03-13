from abc import ABC, abstractmethod


class RedirectBuilderPort(ABC):
    @abstractmethod
    def dashboard_url(self) -> str:
        raise NotImplementedError
