import os
import sys
from pathlib import Path
from datetime import timedelta
import traceback

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(BASE_DIR, '.env'))
except ImportError:
    pass

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-skill-x-change-platform-prod-quality-key-2026')
DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 't')
ALLOWED_HOSTS = [h.strip() for h in os.environ.get('ALLOWED_HOSTS', '*').split(',') if h.strip()]

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'rest_framework',
    'corsheaders',
    'apps.authentication',
    'apps.skills',
    'apps.exchanges',
    'apps.chat',
    'apps.sessions',
    'apps.wallet',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'skillxchange.urls'
WSGI_APPLICATION = 'skillxchange.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# --- Production MongoEngine / MongoDB Atlas Configuration ---
DEFAULT_ATLAS_URI = "mongodb+srv://rachepallinandini_db_user:Nandini2005@cluster0.dli41nw.mongodb.net/skillxchange?retryWrites=true&w=majority"
MONGODB_URI = os.environ.get('MONGODB_URI', DEFAULT_ATLAS_URI)

try:
    import mongoengine
    
    print(">>> Connecting MongoDB Atlas...")
    # Initialize connection pool immediately (connect=False removed)
    mongoengine.connect(
        db='skillxchange',
        host=MONGODB_URI,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000
    )
    
    # Startup Health Check & Validation
    db = mongoengine.connection.get_db()
    client = db.client
    server_info = client.server_info()
    ping_res = client.admin.command('ping')
    
    print(">>> ===========================================")
    print(">>> MongoDB Connected Successfully!")
    print(f">>> Target Database: {db.name}")
    print(f">>> MongoDB Server Version: {server_info.get('version', 'unknown')}")
    print(f">>> Ping Status: {'OK' if ping_res.get('ok', 1.0) == 1.0 else 'FAILED'}")
    print(">>> ===========================================")
except Exception as e:
    tb = traceback.format_exc()
    print(">>> ===========================================")
    print(f"CRITICAL ERROR: Failed to connect to MongoDB Atlas at {MONGODB_URI}")
    print(f"Traceback:\n{tb}")
    print(">>> ===========================================")
    raise RuntimeError(f"MongoDB Atlas Connection Error: {e}") from e

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

CORS_ALLOWED_ORIGINS = [
    'https://frontend-silk-chi-97.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*\.vercel\.app$",
    r"^https:\/\/.*\.onrender\.com$",
]
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
