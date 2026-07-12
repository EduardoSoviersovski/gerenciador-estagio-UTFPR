class DocumentError(Exception):
    pass

class ImageConversionError(DocumentError):
    def __init__(self):
        super().__init__("Error trying to convert image")
