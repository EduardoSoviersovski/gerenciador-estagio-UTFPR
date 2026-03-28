from abc import ABC, abstractmethod


class RedirectBuilderPort(ABC):
    @abstractmethod
    def get_home_url(self) -> str:
        raise NotImplementedError
