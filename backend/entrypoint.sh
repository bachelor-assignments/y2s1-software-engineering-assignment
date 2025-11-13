#!/bin/sh

echo "Running migrations..."

python3 manage.py migrate --noinput

exec "$@"
