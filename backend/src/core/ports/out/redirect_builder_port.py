from abc import ABC, abstractmethod


class RedirectBuilderPort(ABC):
    @abstractmethod
    def home_url(self) -> str:
        raise NotImplementedError
