FROM python:3.12-slim

# Don't write .pyc files; send print() output straight to the logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first, so this layer is cached between code changes
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Then copy the service code and its data file
COPY spell_checker.py ./

# Don't run as root
RUN useradd --create-home appuser
USER appuser

EXPOSE 3000

# gunicorn imports the "app" object from location_microservice.py
CMD ["gunicorn", "--bind", "0.0.0.0:3000", "--workers", "2", "spell_checker:app"]