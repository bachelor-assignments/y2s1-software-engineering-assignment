# Y2S1 5005CMD Software Engineering Assignment

A Scalable Digital Asset Management (DAM) System for Visual AI Application.

### Tech stack used for this project:

| Component       | Technology                 |
|-----------------|----------------------------|
| Frontend        | Next.js, Chakra UI         |
| Backend         | Django                     |
| Database        | PostgreSQL                 |
| Object storage  | MinIO (AWS S3 compatible)  |

### The project deliverables should include:
1. User authentication (login, role-based access: Admin, Editor, Viewer).
2. Asset upload/download with drag-and-drop support.
3. Metadata management (custom fields, tags).
4. Search capability (keyword, filters, date ranges, and tag-based).
5. Asset previews (images, PDFs, videos) and version history.

### How to setup development environment?
1. `cd` into project root directory
2. create an `.env` file based on [example.env](example.env)
3. build images with ```docker compose -f docker-compose-dev.yml build```
4. run using ```docker compose -f docker-compose-dev.yml up``` 
