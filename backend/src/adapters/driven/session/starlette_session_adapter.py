from core.ports.session_port import SessionPort


class StarletteSessionAdapter(SessionPort):
    def get(self, request, key: str, default=None):
        return request.session.get(key, default)

    def set(self, request, key: str, value) -> None:
        request.session[key] = value

    def pop(self, request, key: str, default=None):
        return request.session.pop(key, default)
