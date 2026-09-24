from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed


class SafeTokenAuthentication(TokenAuthentication):
    """
    Robust Token Authentication that gracefully falls back to AnonymousUser
    if an invalid or expired token is presented, allowing AllowAny public endpoints
    (e.g., product catalog, produce search, registration) to succeed without a 401.
    """
    def authenticate(self, request):
        auth = request.headers.get('Authorization', '').split()
        if not auth or auth[0].lower() != self.keyword.lower().encode():
            # Check string header format
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if not auth_header:
                return None
            parts = auth_header.split()
            if len(parts) != 2 or parts[0].lower() != self.keyword.lower():
                return None
            token_key = parts[1]
        else:
            if len(auth) == 1:
                return None
            elif len(auth) > 2:
                return None
            try:
                token_key = auth[1].decode()
            except UnicodeError:
                return None

        if not token_key or token_key in ['null', 'undefined', '']:
            return None

        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=token_key)
        except model.DoesNotExist:
            return None

        if not token.user.is_active:
            return None

        return (token.user, token)
