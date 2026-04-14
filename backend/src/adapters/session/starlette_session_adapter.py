class SessionAdapter:
    @staticmethod
    def get(request, key: str, default=None):
        return request.session.get(key, default)

    @staticmethod
    def set(request, key: str, value) -> None:
        request.session[key] = value

    @staticmethod
    def pop(request, key: str, default=None):
        return request.session.pop(key, default)
