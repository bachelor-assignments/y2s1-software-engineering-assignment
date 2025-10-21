FROM python:3.12-alpine AS base

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

COPY requirements.txt ./

RUN pip install --upgrade pip \
    && pip3 install --no-cache-dir -r requirements.txt

FROM base AS development

COPY . .

# auto migrations
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base AS production

RUN adduser -D nonroot \
    && chown -R nonroot /app

COPY --chown=nonroot:nonroot . .
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

USER nonroot

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "my_docker_django_app.wsgi:application"]