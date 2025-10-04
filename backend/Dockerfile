FROM python:3.12-alpine AS base

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

COPY requirements.txt ./


RUN pip install --upgrade pip \
    && pip3 install --no-cache-dir -r requirements.txt

FROM base AS development

COPY . .

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base AS production

RUN adduser -D nonroot \
    && chown -R nonroot /app

COPY --chown=nonroot:nonroot . .

USER nonroot

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "my_docker_django_app.wsgi:application"]